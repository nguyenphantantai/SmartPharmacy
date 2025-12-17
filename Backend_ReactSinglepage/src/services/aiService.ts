import { config } from '../config/index.js';
import { systemPrompt, systemInstructionGemini } from './aiPrompts.js';

// Lazy load AI clients to avoid errors if packages not installed
let openaiClient: any = null;
let geminiClient: any = null;

// Export initialization function for server startup
export async function initializeAIClients() {
  await initializeClients();
}

// Initialize clients on first use
async function initializeClients() {
  // Initialize OpenAI
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    try {
      // Dynamic import to avoid errors if package not installed
      const openaiModule = await import('openai');
      const OpenAI = (openaiModule as any).default || openaiModule;
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI initialized');
    } catch (error) {
      console.log('⚠️ OpenAI package not installed');
    }
  }

  // Initialize Gemini
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      // IMPORTANT: Never log API key - only use it for initialization
      geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Default to gemini-2.5-flash (stable and fast), user can override with GEMINI_MODEL
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      console.log(`✅ Google Gemini AI initialized (Model: ${modelName})`);
    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error';
      console.log('⚠️ Google Gemini package not installed or error:', errorMsg.substring(0, 100));
      console.log('   Run: npm install @google/generative-ai');
      console.log('   Add GEMINI_API_KEY to environment variables (never commit to git)');
    }
  } else if (!process.env.GEMINI_API_KEY) {
    console.log('ℹ️ GEMINI_API_KEY not found in environment variables');
  }
}

// Alternative: Use other AI services
// - Google Gemini API
// - Anthropic Claude API
// - Local LLM (Ollama, LM Studio)
// - Vietnamese LLM (VinAI, FPT AI)

interface AIChatOptions {
  userMessage: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: {
    medicines?: any[];
    userHistory?: any[];
    symptoms?: string[];
    queryType?: 'medical_consultation' | 'stock_inquiry' | 'price_inquiry' | 'alternative_inquiry' | 'symptom_based';
    productInfo?: any;
    originalProductName?: string;
    alternatives?: any[];
    instruction?: string;
    userQuery?: string;
    isFollowUpAnswer?: boolean;
  };
}

/**
 * Generate AI response using OpenAI GPT
 * Fallback to rule-based system if API key not configured
 */
export async function generateAIResponseWithLLM(options: AIChatOptions): Promise<string> {
  const { userMessage, conversationHistory, context } = options;

  // Initialize if not already done
  await initializeClients();

  // If OpenAI is not configured, return null to use rule-based system
  if (!openaiClient) {
    return null as any; // Signal to use fallback
  }

  try {
    // Build context information
    let contextInfo = '';
    
    // Add instruction for recognizing various question formats
    contextInfo += `\n=== HƯỚNG DẪN NHẬN DIỆN CÂU HỎI ===\n`;
    contextInfo += `Người dùng có thể hỏi theo nhiều cách khác nhau:\n`;
    contextInfo += `- Câu hỏi trực tiếp: "Tôi bị cảm cúm, có thuốc nào không?"\n`;
    contextInfo += `- Mô tả triệu chứng mơ hồ: "Tôi mệt và nhức người", "Người tôi khó chịu quá"\n`;
    contextInfo += `- Câu nói tự nhiên: "Bạn ơi tôi đang bị cảm", "Nay trời lạnh quá, tôi hơi cảm rồi"\n`;
    contextInfo += `- Câu không rõ ý: "Uống cái gì cho khỏe vậy?", "Tôi mệt quá"\n`;
    contextInfo += `Bạn PHẢI tự phân tích để hiểu đúng nhu cầu của họ và hỏi lại 4 thông tin an toàn nếu cần.\n`;
    
    if (context?.medicines && context.medicines.length > 0) {
      contextInfo += `\n\nThông tin thuốc có sẵn trong hệ thống (gợi ý tối đa 3 thuốc):\n`;
      // Limit to 3 medicines max to reduce tokens
      context.medicines.slice(0, 3).forEach((med, idx) => {
        contextInfo += `${idx + 1}. ${med.name}`;
        // QUAN TRỌNG: Chỉ hiển thị công dụng (indication), KHÔNG hiển thị hàm lượng ở đây
        if (med.indication) {
          // Truncate long indications
          const shortIndication = med.indication.length > 200 
            ? med.indication.substring(0, 200) + '...' 
            : med.indication;
          contextInfo += `\n   - Tác dụng: ${shortIndication}`;
        }
        if (med.strength) {
          contextInfo += `\n   - Hàm lượng: ${med.strength}`;
        }
        if (med.price) {
          contextInfo += `\n   - Giá: ${med.price.toLocaleString('vi-VN')}đ`;
        }
        if (med.unit) {
          contextInfo += `\n   - Quy cách: ${med.unit}`;
        }
        contextInfo += '\n';
      });
      contextInfo += `\nLƯU Ý QUAN TRỌNG:\n`;
      contextInfo += `- Khi gợi ý thuốc, bạn PHẢI sử dụng trường "Tác dụng" (không phải hàm lượng) trong phần mô tả công dụng của thuốc.\n`;
      contextInfo += `- CHỈ hiển thị giá nếu có trong danh sách trên, KHÔNG tự ý đưa ra giá ước tính hoặc giá tham khảo.\n`;
      contextInfo += `- Format ngắn gọn: [Số]. **[Tên thuốc]**\n   – Tác dụng: [mô tả ngắn gọn]\n   – Liều: [liều dùng]\n`;
      contextInfo += `- Sau khi liệt kê thuốc, luôn khuyến khích: "Ngoài ra, bạn nên uống nhiều nước, giữ ấm và nghỉ ngơi."\n`;
    }

    if (context?.symptoms && context.symptoms.length > 0) {
      contextInfo += `\nTriệu chứng người dùng đã đề cập: ${context.symptoms.join(', ')}\n`;
      contextInfo += `Yêu cầu gốc: "${(context as any).userQuery || userMessage}"\n`;
      
      // If this is a follow-up answer, add explicit instruction
      if ((context as any).isFollowUpAnswer) {
        contextInfo += `\n⚠️⚠️⚠️ QUAN TRỌNG CỰC KỲ: Đây là follow-up answer. Người dùng đã cung cấp thông tin an toàn.\n`;
        contextInfo += `Bạn PHẢI:\n`;
        contextInfo += `1. Gợi ý thuốc ngay dựa trên triệu chứng "${(context as any).userQuery || ''}"\n`;
        contextInfo += `2. KHÔNG được reset hay chào lại\n`;
        contextInfo += `3. PHẢI liệt kê cụ thể từng thuốc theo format BẮT BUỘC:\n`;
        contextInfo += `   "Dưới đây là các thuốc phù hợp với tình trạng của bạn:\n\n`;
        contextInfo += `   [Số]. **[Tên thuốc]**\n`;
        contextInfo += `   - Công dụng: [mô tả]\n`;
        contextInfo += `   - Liều: [liều dùng]\n`;
        contextInfo += `   - Lưu ý: [lưu ý nếu cần]"\n`;
        contextInfo += `4. ❌ KHÔNG ĐƯỢC trả lời chung chung như:\n`;
        contextInfo += `   - "tham khảo các thuốc như..."\n`;
        contextInfo += `   - "vui lòng liên hệ dược sĩ"\n`;
        contextInfo += `   - "bạn có thể tham khảo các thuốc phổ biến như..."\n`;
        contextInfo += `5. ✅ PHẢI bắt đầu bằng: "Dưới đây là các thuốc phù hợp với tình trạng của bạn:" và liệt kê cụ thể từng thuốc\n`;
      }
      
      contextInfo += `Hãy chỉ gợi ý thuốc PHÙ HỢP với các triệu chứng này.\n`;
    }
    
    // Add explicit instruction if provided
    if ((context as any).instruction) {
      contextInfo += `\n=== HƯỚNG DẪN ĐẶC BIỆT ===\n`;
      contextInfo += `${(context as any).instruction}\n`;
    }

    // Build messages for OpenAI
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt + contextInfo
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call OpenAI API
    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini', // Use gpt-4o-mini for cost efficiency, or gpt-4o for better quality
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    return aiResponse;

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fallback to rule-based system on error
    return null as any;
  }
}

/**
 * Generate AI response using Google Gemini API
 * Free tier: 15 requests per minute, 1500 requests per day
 */
export async function generateAIResponseWithGemini(options: AIChatOptions): Promise<string> {
  const { userMessage, conversationHistory, context } = options;

  // Initialize if not already done
  await initializeClients();

  // If Gemini is not configured, return null to use rule-based system
  if (!geminiClient) {
    return null as any; // Signal to use fallback
  }

  try {
    // Get model (default: gemini-2.5-flash for stable and fast API)
    // Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash, gemini-flash-latest
    // Note: Older models (gemini-pro, gemini-1.5-flash) are deprecated
    let modelName: string = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    // Map old model names to new ones
    const modelMapping: { [key: string]: string } = {
      'gemini-pro': 'gemini-pro-latest',
      'gemini-1.5-flash': 'gemini-2.5-flash',
      'gemini-1.5-pro': 'gemini-2.5-pro',
      'gemini-1.5-flash-latest': 'gemini-2.5-flash'
    };
    
    if (modelName && modelMapping[modelName]) {
      modelName = modelMapping[modelName];
    }
    
    const model = geminiClient.getGenerativeModel({ model: modelName });

    const systemInstruction = systemInstructionGemini;

    // Build context information
    let contextInfo = '';
    
    // Xử lý các loại câu hỏi khác nhau
    if (context?.queryType === 'stock_inquiry' && context?.productInfo) {
      // Câu hỏi về tồn kho
      const product = context.productInfo;
      contextInfo += `\n=== THÔNG TIN TỒN KHO TỪ HỆ THỐNG ===\n`;
      contextInfo += `Khách hàng đang hỏi về tồn kho của sản phẩm.\n\n`;
      contextInfo += `Dữ liệu sản phẩm từ hệ thống nhà thuốc:\n`;
      contextInfo += `- Tên thuốc: ${product.name}\n`;
      contextInfo += `- Số lượng tồn kho: ${product.stockQuantity} ${product.unit}\n`;
      contextInfo += `- Giá bán: ${product.price.toLocaleString('vi-VN')}đ/${product.unit}\n`;
      contextInfo += `- Tình trạng: ${product.inStock ? 'Còn hàng' : 'Hết hàng'}\n\n`;
      contextInfo += `Hãy trả lời câu hỏi của khách hàng một cách lịch sự và dễ hiểu.\n`;
      contextInfo += `Nếu còn hàng, hãy thông báo số lượng và giá. Nếu hết hàng, đề xuất tìm sản phẩm thay thế.\n`;
      contextInfo += `CHỈ sử dụng thông tin được cung cấp ở trên, KHÔNG được bịa thông tin.\n`;
    } else if (context?.queryType === 'price_inquiry' && context?.productInfo) {
      // Câu hỏi về giá
      const product = context.productInfo;
      contextInfo += `\n=== THÔNG TIN GIÁ TỪ HỆ THỐNG ===\n`;
      contextInfo += `Khách hàng đang hỏi về giá của sản phẩm.\n\n`;
      contextInfo += `Dữ liệu sản phẩm từ hệ thống nhà thuốc:\n`;
      contextInfo += `- Tên thuốc: ${product.name}\n`;
      contextInfo += `- Giá bán: ${product.price.toLocaleString('vi-VN')}đ/${product.unit}\n`;
      if (product.originalPrice && product.originalPrice > product.price) {
        contextInfo += `- Giá gốc: ${product.originalPrice.toLocaleString('vi-VN')}đ\n`;
        if (product.discountPercentage > 0) {
          contextInfo += `- Giảm giá: ${product.discountPercentage}%\n`;
        }
      }
      contextInfo += `- Tình trạng: ${product.inStock ? 'Còn hàng' : 'Hết hàng'}\n\n`;
      contextInfo += `Hãy trả lời câu hỏi của khách hàng một cách lịch sự và dễ hiểu.\n`;
      contextInfo += `CHỈ sử dụng thông tin giá được cung cấp ở trên, KHÔNG được bịa giá.\n`;
    } else if (context?.queryType === 'alternative_inquiry' && context?.alternatives) {
      // Câu hỏi về thuốc thay thế
      contextInfo += `\n=== THÔNG TIN THUỐC THAY THẾ TỪ HỆ THỐNG ===\n`;
      contextInfo += `Khách hàng đang tìm thuốc thay thế cho "${context.originalProductName}".\n\n`;
      contextInfo += `Các sản phẩm tương tự hiện có trong kho:\n\n`;
      context.alternatives.forEach((alt: any, idx: number) => {
        contextInfo += `${idx + 1}. ${alt.name}\n`;
        if (alt.indication || alt.description) {
          contextInfo += `   - Hoạt chất/Công dụng: ${(alt.indication || alt.description).substring(0, 150)}\n`;
        }
        if (alt.price) {
          contextInfo += `   - Giá: ${alt.price.toLocaleString('vi-VN')}đ/${alt.unit || 'sản phẩm'}\n`;
        }
        if (alt.stockQuantity) {
          contextInfo += `   - Tồn kho: ${alt.stockQuantity} ${alt.unit || 'sản phẩm'}\n`;
        }
        contextInfo += '\n';
      });
      contextInfo += `Hãy gợi ý cho khách hàng các lựa chọn phù hợp, ngôn ngữ dễ hiểu.\n`;
      contextInfo += `Không khẳng định thay thế hoàn toàn, chỉ gợi ý các lựa chọn tương tự.\n`;
      contextInfo += `CHỈ gợi ý các sản phẩm trong danh sách trên, KHÔNG được gợi ý sản phẩm khác.\n`;
    } else {
      // Câu hỏi tư vấn y tế thông thường
      // Add instruction for recognizing various question formats
      contextInfo += `\n=== HƯỚNG DẪN NHẬN DIỆN CÂU HỎI ===\n`;
      contextInfo += `Người dùng có thể hỏi theo nhiều cách khác nhau:\n`;
      contextInfo += `- Câu hỏi trực tiếp: "Tôi bị cảm cúm, có thuốc nào không?"\n`;
      contextInfo += `- Mô tả triệu chứng mơ hồ: "Tôi mệt và nhức người", "Người tôi khó chịu quá"\n`;
      contextInfo += `- Câu nói tự nhiên: "Bạn ơi tôi đang bị cảm", "Nay trời lạnh quá, tôi hơi cảm rồi"\n`;
      contextInfo += `- Câu không rõ ý: "Uống cái gì cho khỏe vậy?", "Tôi mệt quá"\n`;
      contextInfo += `Bạn PHẢI tự phân tích để hiểu đúng nhu cầu của họ và hỏi lại 4 thông tin an toàn nếu cần.\n`;
    }
    
    if (context?.medicines && context.medicines.length > 0) {
      contextInfo += `\n\n=== THÔNG TIN THUỐC CÓ SẴN TRONG HỆ THỐNG ===\n`;
      contextInfo += `QUAN TRỌNG: Danh sách thuốc dưới đây ĐÃ ĐƯỢC LỌC và CHỈ CHỨA THUỐC PHÙ HỢP với yêu cầu của người dùng.\n`;
      contextInfo += `Bạn PHẢI chỉ gợi ý các thuốc trong danh sách này, KHÔNG được gợi ý thuốc khác.\n`;
      contextInfo += `Chỉ gợi ý 3-5 thuốc phù hợp nhất từ danh sách này.\n\n`;
      
      // Limit to 5 medicines max, prioritize by relevance
      context.medicines.slice(0, 3).forEach((med, idx) => {
        contextInfo += `${idx + 1}. **${med.name}**\n`;
        // QUAN TRỌNG: Chỉ hiển thị công dụng (indication), KHÔNG hiển thị hàm lượng ở đây
        if (med.indication) {
          // Truncate long indications
          const shortIndication = med.indication.length > 200 
            ? med.indication.substring(0, 200) + '...' 
            : med.indication;
          contextInfo += `   - Tác dụng: ${shortIndication}\n`;
        } else if (med.description) {
          const shortDesc = med.description.length > 200 
            ? med.description.substring(0, 200) + '...' 
            : med.description;
          contextInfo += `   - Tác dụng: ${shortDesc}\n`;
        }
        if (med.strength) {
          contextInfo += `   - Hàm lượng: ${med.strength}\n`;
        }
        if (med.price) {
          contextInfo += `   - Giá: ${med.price.toLocaleString('vi-VN')}đ\n`;
        }
        if (med.unit) {
          contextInfo += `   - Quy cách: ${med.unit}\n`;
        }
        if (med.stockQuantity) {
          contextInfo += `   - Tồn kho: ${med.stockQuantity} ${med.unit || 'sản phẩm'}\n`;
        }
        contextInfo += '\n';
      });
      contextInfo += `\n=== QUY TẮC QUAN TRỌNG (BẮT BUỘC) ===\n`;
      contextInfo += `1. CHỈ gợi ý các thuốc trong danh sách trên, KHÔNG được gợi ý thuốc khác.\n`;
      contextInfo += `2. Trường "Tác dụng" PHẢI là mô tả công dụng (ví dụ: "Hạ sốt, giảm đau nhẹ"), KHÔNG được ghi hàm lượng (ví dụ: "500mg" là SAI).\n`;
      contextInfo += `3. Nếu "Tác dụng" trong danh sách chỉ là hàm lượng, bạn PHẢI tạo mô tả công dụng dựa trên tên thuốc.\n`;
      contextInfo += `4. ⚠️⚠️⚠️ BẮT BUỘC CỰC KỲ: Bạn PHẢI liệt kê cụ thể từng thuốc theo format dưới đây. KHÔNG được trả lời chung chung.\n`;
      contextInfo += `   Format BẮT BUỘC (KHÔNG ĐƯỢC SAI):\n`;
      contextInfo += `   Dưới đây là các thuốc phù hợp với tình trạng của bạn:\n\n`;
      contextInfo += `   [Số]. **[Tên thuốc]** (tên thương hiệu nếu có)\n`;
      contextInfo += `   - Công dụng: [mô tả công dụng ngắn gọn, 1 dòng]\n`;
      contextInfo += `   - Liều: [liều dùng ngắn gọn] hoặc "Theo hướng dẫn bao bì / hỏi dược sĩ"\n`;
      contextInfo += `   [CHỈ hiển thị giá nếu có trong danh sách trên: 💰 Giá: [giá]đ]\n`;
      contextInfo += `   - Lưu ý: [lưu ý an toàn nếu cần]\n\n`;
      contextInfo += `   ⚠️ Lưu ý chung:\n`;
      contextInfo += `   - Không dùng chung nhiều thuốc chứa cùng hoạt chất.\n`;
      contextInfo += `   - Nếu sốt cao >39°C, khó thở, đau ngực → đi khám ngay.\n`;
      contextInfo += `   - Đọc kỹ hướng dẫn sử dụng trước khi dùng.\n\n`;
      contextInfo += `   Ngoài ra, bạn nên uống nhiều nước, giữ ấm và nghỉ ngơi.\n`;
      contextInfo += `5. ❌❌❌ KHÔNG ĐƯỢC trả lời kiểu:\n`;
      contextInfo += `   - "Tham khảo các thuốc như Paracetamol, Decolgen... vui lòng liên hệ dược sĩ"\n`;
      contextInfo += `   - "Bạn có thể tham khảo các thuốc phổ biến như..."\n`;
      contextInfo += `   - "Vui lòng liên hệ dược sĩ để được tư vấn cụ thể hơn"\n`;
      contextInfo += `6. ✅✅✅ PHẢI trả lời kiểu: Liệt kê cụ thể từng thuốc với số thứ tự, tên thuốc in đậm, công dụng, liều dùng theo đúng format trên\n`;
    }

    if (context?.symptoms && context.symptoms.length > 0) {
      contextInfo += `\n=== TRIỆU CHỨNG NGƯỜI DÙNG ===\n`;
      contextInfo += `Người dùng đã đề cập: ${context.symptoms.join(', ')}\n`;
      contextInfo += `Yêu cầu gốc: "${(context as any).userQuery || userMessage}"\n`;
      
      // Add specific symptom analysis instruction
      contextInfo += `\n⚠️⚠️⚠️ PHÂN TÍCH TRIỆU CHỨNG (BẮT BUỘC):\n`;
      contextInfo += `Bạn PHẢI phân tích ĐÚNG triệu chứng trong TIN NHẮN MỚI NHẤT và gợi ý thuốc PHÙ HỢP:\n`;
      
      const symptoms = context.symptoms;
      const userQuery = ((context as any).userQuery || userMessage).toLowerCase();
      
      // Check for specific symptoms and provide strict rules
      if (userQuery.includes('nghẹt mũi') || userQuery.includes('sổ mũi') || userQuery.includes('tắc mũi')) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Nghẹt mũi/Sổ mũi\n`;
        contextInfo += `✅ PHẢI gợi ý: Natri Clorid 0.9%, Xịt mũi muối biển, Otrivin, Naphazoline, Rhinocort\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Paracetamol, Terpin Codein, Acetylcysteine, Bromhexin (đây là thuốc ho/sốt, KHÔNG phải thuốc nghẹt mũi)\n`;
      }
      
      if (userQuery.includes('ho khan') || (userQuery.includes('ho') && !userQuery.includes('đờm'))) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Ho khan\n`;
        contextInfo += `✅ PHẢI gợi ý: Terpin Codein, Dextromethorphan\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Paracetamol, Panadol, Ibuprofen, Efferalgan (đây là thuốc sốt/đau, KHÔNG phải thuốc ho)\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Acetylcysteine, Bromhexin (chỉ dùng cho ho đờm)\n`;
      }
      
      if (userQuery.includes('ho đờm') || userQuery.includes('ho có đờm')) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Ho đờm\n`;
        contextInfo += `✅ PHẢI gợi ý: Acetylcysteine, Bromhexin, Ambroxol, Prospan\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Terpin Codein (chỉ dùng cho ho khan)\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Paracetamol, Panadol (đây là thuốc sốt/đau)\n`;
      }
      
      if (userQuery.includes('đau đầu') || userQuery.includes('nhức đầu')) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Đau đầu\n`;
        contextInfo += `✅ PHẢI gợi ý: Paracetamol, Ibuprofen\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Decolgen, Tiffy (trừ khi có nghẹt mũi/sổ mũi kèm theo)\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Terpin Codein, Acetylcysteine (đây là thuốc ho)\n`;
      }
      
      if (userQuery.includes('sốt') && !userQuery.includes('cảm') && !userQuery.includes('cúm')) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Sốt\n`;
        contextInfo += `✅ PHẢI gợi ý: Paracetamol, Panadol, Efferalgan\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG tự thêm: Decolgen, Tiffy (chỉ thêm nếu có nghẹt mũi kèm theo)\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Terpin Codein, Acetylcysteine (đây là thuốc ho)\n`;
      }
      
      if (userQuery.includes('cảm cúm') || (userQuery.includes('cảm') && (userQuery.includes('sốt') || userQuery.includes('đau đầu') || userQuery.includes('nghẹt mũi')))) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Cảm cúm (nhiều triệu chứng)\n`;
        contextInfo += `✅ PHẢI gợi ý combo: Paracetamol + Decolgen/Tiffy\n`;
      }
      
      if (userQuery.includes('mệt') || userQuery.includes('nhức người') || userQuery.includes('khó chịu')) {
        contextInfo += `\n🔍 TRIỆU CHỨNG: Mệt mỏi/Nhức người (MƠ HỒ)\n`;
        contextInfo += `⚠️ BẠN PHẢI HỎI LẠI triệu chứng cụ thể: "Bạn có sốt, đau đầu, nghẹt mũi, ho hay triệu chứng nào khác không?"\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG được gợi ý thuốc khi triệu chứng mơ hồ\n`;
        contextInfo += `❌ TUYỆT ĐỐI KHÔNG gợi ý: Terpin Codein, Acetylcysteine (đây là thuốc ho, không phải thuốc mệt mỏi)\n`;
      }
      
      contextInfo += `\n⚠️⚠️⚠️ QUY TẮC CHẶT CHẼ:\n`;
      contextInfo += `1. KHÔNG được tái sử dụng danh sách thuốc từ câu trả lời trước\n`;
      contextInfo += `2. KHÔNG được gợi ý thuốc ho cho nghẹt mũi hoặc sốt\n`;
      contextInfo += `3. KHÔNG được gợi ý thuốc sốt/đau cho ho\n`;
      contextInfo += `4. Mỗi triệu chứng PHẢI có danh sách thuốc RIÊNG\n`;
      contextInfo += `5. Trước khi trả lời, TỰ KIỂM TRA: Thuốc có đúng triệu chứng không? Có bị lặp không?\n`;
      
      // If this is a follow-up answer, add explicit instruction
      if ((context as any).isFollowUpAnswer) {
        contextInfo += `\n⚠️⚠️⚠️ QUAN TRỌNG CỰC KỲ: Đây là follow-up answer. Người dùng đã cung cấp thông tin an toàn.\n`;
        contextInfo += `Bạn PHẢI:\n`;
        contextInfo += `1. Gợi ý thuốc ngay dựa trên triệu chứng "${(context as any).userQuery || ''}"\n`;
        contextInfo += `2. KHÔNG được reset hay chào lại\n`;
        contextInfo += `3. PHẢI liệt kê cụ thể từng thuốc theo format BẮT BUỘC:\n`;
        contextInfo += `   "Dưới đây là các thuốc phù hợp với tình trạng của bạn:\n\n`;
        contextInfo += `   [Số]. **[Tên thuốc]**\n`;
        contextInfo += `   - Công dụng: [mô tả]\n`;
        contextInfo += `   - Liều: [liều dùng]\n`;
        contextInfo += `   - Lưu ý: [lưu ý nếu cần]"\n`;
        contextInfo += `4. ❌ KHÔNG ĐƯỢC trả lời chung chung như:\n`;
        contextInfo += `   - "tham khảo các thuốc như..."\n`;
        contextInfo += `   - "vui lòng liên hệ dược sĩ"\n`;
        contextInfo += `   - "bạn có thể tham khảo các thuốc phổ biến như..."\n`;
        contextInfo += `5. ✅ PHẢI bắt đầu bằng: "Dưới đây là các thuốc phù hợp với tình trạng của bạn:" và liệt kê cụ thể từng thuốc\n`;
      }
      
      contextInfo += `Bạn PHẢI chỉ gợi ý thuốc PHÙ HỢP với triệu chứng này từ danh sách thuốc đã được lọc ở trên.\n`;
    }
    
    // Add explicit instruction if provided
    if ((context as any).instruction) {
      contextInfo += `\n=== HƯỚNG DẪN ĐẶC BIỆT ===\n`;
      contextInfo += `${(context as any).instruction}\n`;
    }

    if (context?.userHistory && context.userHistory.length > 0) {
      contextInfo += `\nLịch sử mua hàng của người dùng:\n`;
      context.userHistory.slice(0, 3).forEach((item, idx) => {
        contextInfo += `${idx + 1}. ${item.productName}\n`;
      });
    }

    // Build conversation history for Gemini
    // Gemini requires: first message must be from 'user', not 'model'
    // Format: parts array with text
    const chatHistory: any[] = [];
    
    // Filter and add conversation history
    // Skip if history starts with 'assistant' (model) - Gemini doesn't allow this
    let skipFirst = false;
    if (conversationHistory.length > 0 && conversationHistory[0]?.role === 'assistant') {
      skipFirst = true;
    }
    
    for (let i = 0; i < conversationHistory.length; i++) {
      const msg = conversationHistory[i];
      
      // Skip if message is undefined
      if (!msg) {
        continue;
      }
      
      // Skip first message if it's from assistant
      if (i === 0 && skipFirst) {
        continue;
      }
      
      if (msg.role === 'user') {
        chatHistory.push({
          role: 'user',
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'assistant') {
        chatHistory.push({
          role: 'model',
          parts: [{ text: msg.content }]
        });
      }
    }

    // Start chat session
    // systemInstruction must be an object with parts array, not a string
    const fullSystemInstruction = systemInstructionGemini + contextInfo;
    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory : undefined, // Only include if not empty
      systemInstruction: {
        parts: [{ text: fullSystemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096, // Increased to prevent response truncation
      },
    });

    // Send user message
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    let aiResponse = response.text();
    
    // Check if response was truncated (ends abruptly)
    // Gemini sometimes truncates if maxOutputTokens is reached
    if (aiResponse && aiResponse.length > 0) {
      console.log(`✅ Gemini response received (${aiResponse.length} characters)`);
      
      // If response seems incomplete (ends mid-sentence), log a warning
      const lastChar = aiResponse.trim().slice(-1);
      if (!['.', '!', '?', ':', ';'].includes(lastChar) && aiResponse.length > 1000) {
        console.log('⚠️ Response might be truncated (does not end with punctuation)');
      }
    }

    return aiResponse;

  } catch (error: any) {
    // Log error without exposing sensitive information
    const errorMessage = error?.message || 'Unknown error';
    const errorStatus = error?.status || 'N/A';
    
    // Handle specific error types
    if (errorStatus === 403 || errorMessage?.includes('403') || errorMessage?.includes('Forbidden')) {
      if (errorMessage?.includes('leaked') || errorMessage?.includes('API key')) {
        console.error('❌ Gemini API key issue detected. Please check your GEMINI_API_KEY in environment variables.');
        console.error('   Error: API key was reported as leaked or invalid');
      } else {
        console.error('❌ Gemini API access forbidden (403). Check API key permissions.');
      }
    } else if (errorStatus === 429 || errorMessage?.includes('429') || errorMessage?.includes('quota') || errorMessage?.includes('rate limit')) {
      console.log('⚠️ Gemini API rate limit reached, falling back to rule-based system');
    } else {
      // Log generic error without full error object (may contain sensitive info)
      console.error(`❌ Error calling Gemini API (Status: ${errorStatus}): ${errorMessage.substring(0, 200)}`);
    }
    
    // Fallback to rule-based system on error
    return null as any;
  }
}

/**
 * Generate AI response using Anthropic Claude API (Alternative)
 */
export async function generateAIResponseWithClaude(options: AIChatOptions): Promise<string> {
  // Implementation for Anthropic Claude API
  // Requires: npm install @anthropic-ai/sdk
  // import Anthropic from '@anthropic-ai/sdk';
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // ...
  return null as any;
}

/**
 * Generate AI response using local LLM (Ollama) - Free alternative
 */
export async function generateAIResponseWithOllama(options: AIChatOptions): Promise<string> {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2:3b'; // or 'mistral', 'phi3', etc.

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Bạn là trợ lý AI chuyên về dược phẩm. Trả lời bằng tiếng Việt, chính xác và an toàn.'
          },
          ...options.conversationHistory,
          { role: 'user', content: options.userMessage }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      return null as any;
    }

    const data = await response.json();
    return data.message?.content || null as any;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    return null as any;
  }
}

