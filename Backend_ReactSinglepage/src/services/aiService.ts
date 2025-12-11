import { config } from '../config/index.js';

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
      geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Default to gemini-2.5-flash (stable and fast), user can override with GEMINI_MODEL
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      console.log(`✅ Google Gemini AI initialized (Model: ${modelName})`);
    } catch (error: any) {
      console.log('⚠️ Google Gemini package not installed or error:', error.message);
      console.log('   Run: npm install @google/generative-ai');
      console.log('   Add GEMINI_API_KEY to .env file');
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
    // Build system prompt for pharmacy assistant
    const systemPrompt = `Bạn là trợ lý AI chuyên nghiệp của Nhà Thuốc Thông Minh. Nhiệm vụ của bạn:

1. **Hiểu đúng ngữ cảnh**: Phân tích chính xác yêu cầu của khách hàng và chỉ gợi ý thuốc PHÙ HỢP với triệu chứng/bệnh họ đề cập. KHÔNG BAO GIỜ gợi ý thuốc không liên quan.

2. **Hỏi thêm triệu chứng**: Khi khách hàng yêu cầu thuốc chung chung (ví dụ: "thuốc cảm"), bạn NÊN hỏi thêm 1-2 câu về triệu chứng cụ thể (ho, nghẹt mũi, sốt, đau họng...) trước khi gợi ý thuốc.

3. **Gợi ý thuốc chính xác**:
   - Chỉ gợi ý 3-5 thuốc phù hợp nhất (KHÔNG quá nhiều)
   - Ưu tiên thuốc OTC (không cần đơn bác sĩ)
   - Phân loại theo nhóm: hạ sốt-giảm đau, cảm tổng hợp, long đờm, ho khan, v.v.
   - KHÔNG gợi ý thuốc không liên quan (ví dụ: hỏi cảm nhưng gợi ý probiotics, thuốc ho trẻ em)

4. **Format chuyên nghiệp khi gợi ý thuốc**:
   - Sử dụng format sau cho mỗi thuốc:
     ```
     [Số]. **[Tên thuốc]**
     💰 Giá: [giá]đ
     💊 Tác dụng: [mô tả công dụng rõ ràng, KHÔNG phải hàm lượng]
     📦 Quy cách: [đơn vị/quy cách]
     ```
   - QUAN TRỌNG: Trường "Tác dụng" phải là mô tả công dụng (ví dụ: "Hạ sốt, giảm đau nhẹ"), KHÔNG được ghi hàm lượng (ví dụ: "500mg" là SAI)

5. **Thông tin chính xác**: 
   - Sử dụng thông tin từ context (danh sách thuốc được cung cấp)
   - Nếu không có thông tin, nói rõ "Vui lòng liên hệ dược sĩ"

6. **Cảnh báo an toàn**:
   - Luôn cảnh báo: "⚠️ Đây chỉ là tư vấn tham khảo. Vui lòng hỏi dược sĩ trước khi dùng."
   - Cảnh báo ngay khi phát hiện tình trạng nghiêm trọng (sốt cao >39°C, đau ngực, khó thở...)

7. **Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp**

QUAN TRỌNG:
- KHÔNG được thay thế chỉ định của bác sĩ
- Luôn khuyến khích tham khảo ý kiến dược sĩ/bác sĩ
- KHÔNG bán kháng sinh không cần đơn
- Chỉ gợi ý thuốc OTC (không cần đơn bác sĩ)
- Hiểu đúng ngữ cảnh: Nếu khách hỏi "thuốc cảm" → chỉ gợi ý thuốc cảm, KHÔNG gợi ý thuốc khác`;

    // Build context information
    let contextInfo = '';
    if (context?.medicines && context.medicines.length > 0) {
      contextInfo += `\n\nThông tin thuốc có sẵn trong hệ thống (chỉ gợi ý 3-5 thuốc phù hợp nhất):\n`;
      // Limit to 5 medicines max, prioritize by relevance
      context.medicines.slice(0, 5).forEach((med, idx) => {
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
      contextInfo += `\nLƯU Ý: Khi gợi ý thuốc, bạn PHẢI sử dụng trường "Tác dụng" (không phải hàm lượng) trong phần mô tả công dụng của thuốc.\n`;
    }

    if (context?.symptoms && context.symptoms.length > 0) {
      contextInfo += `\nTriệu chứng người dùng đã đề cập: ${context.symptoms.join(', ')}\n`;
      contextInfo += `Hãy chỉ gợi ý thuốc PHÙ HỢP với các triệu chứng này.\n`;
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

    // Build system instruction for pharmacy assistant
    const systemInstruction = `Bạn là trợ lý AI chuyên nghiệp của Nhà Thuốc Thông Minh. Nhiệm vụ của bạn:

1. **Hiểu đúng ngữ cảnh**: Phân tích chính xác yêu cầu của khách hàng và chỉ gợi ý thuốc PHÙ HỢP với triệu chứng/bệnh họ đề cập. KHÔNG BAO GIỜ gợi ý thuốc không liên quan.

2. **Hỏi thêm triệu chứng**: Khi khách hàng yêu cầu thuốc chung chung (ví dụ: "thuốc cảm"), bạn NÊN hỏi thêm 1-2 câu về triệu chứng cụ thể (ho, nghẹt mũi, sốt, đau họng...) trước khi gợi ý thuốc.

3. **Gợi ý thuốc chính xác**:
   - Chỉ gợi ý 3-5 thuốc phù hợp nhất (KHÔNG quá nhiều)
   - Ưu tiên thuốc OTC (không cần đơn bác sĩ)
   - Phân loại theo nhóm: hạ sốt-giảm đau, cảm tổng hợp, long đờm, ho khan, v.v.
   - KHÔNG gợi ý thuốc không liên quan (ví dụ: hỏi cảm nhưng gợi ý probiotics, thuốc ho trẻ em)

4. **Format chuyên nghiệp khi gợi ý thuốc**:
   - Sử dụng format sau cho mỗi thuốc:
     ```
     [Số]. **[Tên thuốc]**
     💰 Giá: [giá]đ
     💊 Tác dụng: [mô tả công dụng rõ ràng, KHÔNG phải hàm lượng]
     📦 Quy cách: [đơn vị/quy cách]
     ```
   - QUAN TRỌNG: Trường "Tác dụng" phải là mô tả công dụng (ví dụ: "Hạ sốt, giảm đau nhẹ"), KHÔNG được ghi hàm lượng (ví dụ: "500mg" là SAI)

5. **Thông tin chính xác**: 
   - Sử dụng thông tin từ context (danh sách thuốc được cung cấp)
   - Nếu không có thông tin, nói rõ "Vui lòng liên hệ dược sĩ"

6. **Cảnh báo an toàn**:
   - Luôn cảnh báo: "⚠️ Đây chỉ là tư vấn tham khảo. Vui lòng hỏi dược sĩ trước khi dùng."
   - Cảnh báo ngay khi phát hiện tình trạng nghiêm trọng (sốt cao >39°C, đau ngực, khó thở...)

7. **Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp**

QUAN TRỌNG:
- KHÔNG được thay thế chỉ định của bác sĩ
- Luôn khuyến khích tham khảo ý kiến dược sĩ/bác sĩ
- KHÔNG bán kháng sinh không cần đơn
- Chỉ gợi ý thuốc OTC (không cần đơn bác sĩ)
- Hiểu đúng ngữ cảnh: Nếu khách hỏi "thuốc cảm" → chỉ gợi ý thuốc cảm, KHÔNG gợi ý thuốc khác`;

    // Build context information
    let contextInfo = '';
    if (context?.medicines && context.medicines.length > 0) {
      contextInfo += `\n\nThông tin thuốc có sẵn trong hệ thống (chỉ gợi ý 3-5 thuốc phù hợp nhất):\n`;
      // Limit to 5 medicines max, prioritize by relevance
      context.medicines.slice(0, 5).forEach((med, idx) => {
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
        if (med.stockQuantity) {
          contextInfo += `\n   - Tồn kho: ${med.stockQuantity} ${med.unit || 'sản phẩm'}`;
        }
        contextInfo += '\n';
      });
      contextInfo += `\nLƯU Ý: Khi gợi ý thuốc, bạn PHẢI sử dụng trường "Tác dụng" (không phải hàm lượng) trong phần mô tả công dụng của thuốc.\n`;
    }

    if (context?.symptoms && context.symptoms.length > 0) {
      contextInfo += `\nTriệu chứng người dùng đã đề cập: ${context.symptoms.join(', ')}\n`;
      contextInfo += `Hãy chỉ gợi ý thuốc PHÙ HỢP với các triệu chứng này.\n`;
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
    const fullSystemInstruction = systemInstruction + contextInfo;
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
    console.error('Error calling Gemini API:', error);
    
    // Handle rate limit errors
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.log('⚠️ Gemini API rate limit reached, falling back to rule-based system');
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

