# 🔄 LUỒNG CHAT BOX GEMINI - TÓM TẮT NGẮN GỌN

## 📋 LUỒNG XỬ LÝ (5 BƯỚC)

### **1. Client gửi request**
```
POST /api/chat
{ message: "Tôi bị cảm cúm", conversationHistory: [...] }
```

### **2. Controller xử lý**
- File: `chatController.ts` → hàm `chatWithAI()`
- Kiểm tra: có image? → OCR | có text? → AI

### **3. Phân tích & tìm thuốc**
- Phát hiện follow-up answer (user trả lời 4 câu hỏi an toàn)
- Tìm triệu chứng trong message
- Query database → lấy 3 thuốc phù hợp nhất
- Xây dựng context: `{ medicines, symptoms, userQuery }`

### **4. Gọi Gemini AI**
- File: `aiService.ts` → `generateAIResponseWithGemini()`
- Khởi tạo: `GoogleGenerativeAI` với API key
- Model: `gemini-2.5-flash`
- System Instruction: Quy tắc tư vấn thuốc + Context thuốc
- Gọi API: `chat.sendMessage(userMessage)`

### **5. Trả về response**
- Kiểm tra response hợp lệ
- Nếu lỗi → Fallback: OpenAI → Ollama → Rule-based
- Trả về JSON: `{ success, response, timestamp }`

---

## 🎯 TÍNH NĂNG CHÍNH

1. **Hỏi 4 câu an toàn:** Tuổi, mang thai, dị ứng, bệnh nền
2. **Mapping triệu chứng → thuốc:** "nghẹt mũi" → Natri Clorid (KHÔNG phải Paracetamol)
3. **Format chuẩn:** Liệt kê thuốc với công dụng, liều dùng
4. **Cảnh báo nguy hiểm:** Sốt cao, khó thở → Khuyên đi khám
5. **Giữ ngữ cảnh:** Nhớ triệu chứng ban đầu khi follow-up

---

## 📊 SƠ ĐỒ ĐƠN GIẢN

```
Client → Route → Controller → Phân tích → Tìm thuốc → Gemini AI → Response
```

---

## 💬 GIẢI THÍCH CHO GIÁO VIÊN (30 GIÂY)

**"Hệ thống chat box sử dụng Google Gemini AI để tư vấn thuốc. Khi người dùng mô tả triệu chứng:**

1. **Hệ thống phân tích** triệu chứng và tìm thuốc phù hợp trong database
2. **Hỏi 4 câu an toàn** (tuổi, mang thai, dị ứng, bệnh nền)
3. **Gửi context** (thuốc + triệu chứng) đến Gemini AI
4. **AI trả về** danh sách thuốc với format chuẩn
5. **Có fallback** 3 tầng nếu AI lỗi: Gemini → OpenAI → Rule-based"

---

## 🔑 FILES QUAN TRỌNG

- `src/routes/chatRoutes.ts` - Route
- `src/controllers/chatController.ts` - Logic chính
- `src/services/aiService.ts` - Gemini integration
- `src/services/aiPrompts.ts` - System prompts

---

**Xem file `LUONG_CHAT_GEMINI.md` để biết chi tiết đầy đủ.**

