# 🔄 LUỒNG CHAT BOX GEMINI - HỆ THỐNG NHÀ THUỐC THÔNG MINH

## 📋 TÓM TẮT NGẮN GỌN

**Chat box Gemini** là hệ thống AI tư vấn thuốc tự động, sử dụng **Google Gemini AI** để phân tích triệu chứng và gợi ý thuốc phù hợp từ database.

---

## 🔄 LUỒNG XỬ LÝ CHI TIẾT

### **1. NHẬN REQUEST TỪ CLIENT**
```
POST /api/chat
Body: {
  message: "Tôi bị cảm cúm, có thuốc nào không?",
  conversationHistory: [...],
  image?: base64 (nếu có)
}
```

**File:** `Backend_ReactSinglepage/src/routes/chatRoutes.ts`
- Route: `POST /` → gọi `chatWithAI` controller

---

### **2. XỬ LÝ TRONG CONTROLLER**
**File:** `Backend_ReactSinglepage/src/controllers/chatController.ts`

#### **2.1. Kiểm tra loại input:**
- **Nếu có image** → Xử lý OCR đơn thuốc (Tesseract.js)
- **Nếu có text message** → Tiếp tục xử lý AI

#### **2.2. Gọi hàm `generateAIResponse()`:**
```typescript
const aiResponse = await generateAIResponse(
  message.trim(),
  conversationHistory,
  userId
);
```

---

### **3. XỬ LÝ TRONG `generateAIResponse()`**

#### **3.1. Phân tích ngữ cảnh:**
- **Phát hiện follow-up answer:** Kiểm tra xem user có đang trả lời 4 câu hỏi an toàn không
- **Tìm triệu chứng trong lịch sử:** Lấy triệu chứng ban đầu nếu đây là follow-up
- **Kết hợp message:** Nếu follow-up, kết hợp triệu chứng gốc + thông tin an toàn

#### **3.2. Tìm kiếm thuốc phù hợp:**
- **Semantic Search:** Dựa vào `symptomToMedicines` mapping
- **Tìm trong database:** Query MongoDB để lấy thuốc phù hợp với triệu chứng
- **Giới hạn:** Chỉ lấy 3 thuốc phù hợp nhất

#### **3.3. Xây dựng Context cho AI:**
```typescript
context = {
  medicines: [...],      // Danh sách thuốc đã filter
  symptoms: [...],       // Triệu chứng phát hiện
  userQuery: "...",      // Câu hỏi gốc
  isFollowUpAnswer: true/false,
  userHistory: [...]    // Lịch sử mua hàng (nếu có)
}
```

---

### **4. GỌI GEMINI AI**
**File:** `Backend_ReactSinglepage/src/services/aiService.ts`

#### **4.1. Khởi tạo Gemini Client:**
```typescript
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = geminiClient.getGenerativeModel({ 
  model: 'gemini-2.5-flash' 
});
```

#### **4.2. Xây dựng System Instruction:**
- **System Prompt:** Từ `aiPrompts.ts` - chứa quy tắc tư vấn thuốc
- **Context Info:** Thêm thông tin thuốc, triệu chứng, hướng dẫn format
- **Follow-up Instruction:** Nếu là follow-up, thêm hướng dẫn đặc biệt

#### **4.3. Xây dựng Conversation History:**
- Chuyển đổi format: `user/assistant` → `user/model` (Gemini format)
- Bỏ qua message đầu nếu là từ `assistant` (Gemini yêu cầu)

#### **4.4. Gọi API Gemini:**
```typescript
const chat = model.startChat({
  history: chatHistory,
  systemInstruction: {
    parts: [{ text: fullSystemInstruction }]
  },
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4096
  }
});

const result = await chat.sendMessage(userMessage);
const aiResponse = result.response.text();
```

---

### **5. XỬ LÝ RESPONSE**

#### **5.1. Kiểm tra response:**
- Nếu AI trả về default message (reset) → Fallback về rule-based system
- Nếu response hợp lệ → Trả về cho client

#### **5.2. Fallback (nếu Gemini lỗi):**
1. **OpenAI GPT** (nếu có API key)
2. **Ollama** (local LLM)
3. **Rule-based system** (logic cố định)

---

### **6. TRẢ VỀ CLIENT**
```json
{
  "success": true,
  "response": "Dưới đây là các thuốc phù hợp...",
  "timestamp": "2024-...",
  "type": "text"
}
```

---

## 🎯 CÁC TÍNH NĂNG CHÍNH

### **1. Hỏi 4 câu thông tin an toàn:**
Khi user mô tả triệu chứng, AI sẽ hỏi:
1. Tuổi
2. Mang thai/cho con bú?
3. Dị ứng thuốc?
4. Bệnh nền?

### **2. Phân tích triệu chứng:**
- Mapping triệu chứng → thuốc phù hợp
- Ví dụ: "nghẹt mũi" → Natri Clorid, Otrivin (KHÔNG gợi ý Paracetamol)

### **3. Format response chuẩn:**
```
Dưới đây là các thuốc phù hợp với tình trạng của bạn:

1. **[Tên thuốc]**
   - Công dụng: [mô tả]
   - Liều: [liều dùng]
   - Lưu ý: [lưu ý an toàn]
```

### **4. Cảnh báo nguy hiểm:**
- Sốt cao >39.5°C → Khuyên đi khám
- Khó thở, đau ngực → Không tư vấn thuốc

### **5. Giữ ngữ cảnh hội thoại:**
- Không reset khi follow-up
- Nhớ triệu chứng ban đầu
- Kết hợp thông tin an toàn với triệu chứng

---

## 📊 SƠ ĐỒ LUỒNG

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │ POST /api/chat
       │ { message, history }
       ▼
┌──────────────────┐
│  chatRoutes.ts   │
│  Route Handler   │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  chatController.ts   │
│  chatWithAI()        │
└──────┬───────────────┘
       │
       │ generateAIResponse()
       ▼
┌──────────────────────┐
│  Phân tích ngữ cảnh  │
│  - Follow-up?        │
│  - Triệu chứng?      │
│  - Tìm thuốc         │
└──────┬───────────────┘
       │
       │ Xây dựng context
       ▼
┌──────────────────────┐
│   aiService.ts       │
│   generateAIResponse │
│   WithGemini()       │
└──────┬───────────────┘
       │
       │ Gọi Gemini API
       ▼
┌──────────────────────┐
│  Google Gemini AI   │
│  (gemini-2.5-flash)  │
└──────┬───────────────┘
       │
       │ Response
       ▼
┌──────────────────────┐
│  Kiểm tra & xử lý    │
│  - Valid?            │
│  - Fallback?         │
└──────┬───────────────┘
       │
       │ JSON response
       ▼
┌─────────────┐
│   Client    │
│  (Frontend) │
└─────────────┘
```

---

## 🔑 CÁC FILE QUAN TRỌNG

1. **`src/routes/chatRoutes.ts`** - Route definition
2. **`src/controllers/chatController.ts`** - Main controller logic
3. **`src/services/aiService.ts`** - Gemini AI integration
4. **`src/services/aiPrompts.ts`** - System prompts và instructions
5. **`src/services/medicineMatchingService.ts`** - Tìm kiếm thuốc

---

## ⚙️ CẤU HÌNH

### **Environment Variables:**
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash  # Optional, default: gemini-2.5-flash
```

### **Model Options:**
- `gemini-2.5-flash` (default) - Nhanh, ổn định
- `gemini-2.5-pro` - Chất lượng cao hơn
- `gemini-2.0-flash` - Phiên bản mới

---

## 📝 VÍ DỤ THỰC TẾ

### **Request 1:**
```
User: "Tôi bị cảm cúm, có thuốc nào không?"
```

**Response:**
```
Để tư vấn an toàn, bạn vui lòng cho tôi biết thêm:
1. Bạn bao nhiêu tuổi?
2. Bạn có đang mang thai hoặc cho con bú không?
3. Bạn có bị dị ứng thuốc nào không?
4. Bạn có bệnh nền (tim mạch, gan, thận, huyết áp...) không?
```

### **Request 2 (Follow-up):**
```
User: "22 tuổi, không mang thai, không dị ứng, không bệnh nền"
```

**Response:**
```
Dưới đây là các thuốc phù hợp với tình trạng của bạn:

1. **Paracetamol 500mg** (Hapacol / Panadol)
   - Công dụng: Giảm sốt, giảm đau đầu, đau nhức
   - Liều: 1 viên 500mg mỗi 4-6 giờ, tối đa 8 viên/ngày
   - Lưu ý: Không dùng quá 4g Paracetamol/ngày

2. **Decolgen Forte**
   - Công dụng: Giảm nghẹt mũi, sổ mũi, đau đầu
   - Liều: 1 viên mỗi 6 giờ
   - Lưu ý: Có thể gây buồn ngủ

⚠️ Lưu ý chung:
- Không dùng chung nhiều thuốc chứa Paracetamol.
- Nếu sốt cao liên tục >39°C, khó thở, đau ngực → đi khám ngay.

Ngoài ra, bạn nên uống nhiều nước, giữ ấm và nghỉ ngơi.
```

---

## ✅ ĐIỂM MẠNH

1. **Thông minh:** Sử dụng Gemini AI để hiểu ngữ cảnh tự nhiên
2. **An toàn:** Luôn hỏi 4 câu thông tin an toàn trước khi tư vấn
3. **Chính xác:** Mapping triệu chứng → thuốc phù hợp
4. **Linh hoạt:** Fallback nhiều tầng nếu AI lỗi
5. **Giữ ngữ cảnh:** Nhớ triệu chứng ban đầu khi follow-up

---

## 🎓 GIẢI THÍCH CHO GIÁO VIÊN (NGẮN GỌN)

**"Hệ thống chat box sử dụng Google Gemini AI để tư vấn thuốc tự động. Khi người dùng mô tả triệu chứng, hệ thống sẽ:**

1. **Phân tích triệu chứng** và tìm thuốc phù hợp trong database
2. **Hỏi 4 câu thông tin an toàn** (tuổi, mang thai, dị ứng, bệnh nền)
3. **Gửi context** (thuốc, triệu chứng, lịch sử) đến Gemini AI
4. **Nhận response** từ AI và format theo chuẩn
5. **Trả về** danh sách thuốc cụ thể với công dụng, liều dùng

**Hệ thống có fallback 3 tầng: Gemini → OpenAI → Rule-based để đảm bảo luôn có response."**

---

**Tài liệu này giải thích luồng xử lý chat box Gemini trong hệ thống Nhà Thuốc Thông Minh.**

