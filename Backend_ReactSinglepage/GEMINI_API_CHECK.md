# Hướng dẫn kiểm tra Multiple Instances sử dụng Gemini API Key

## 🔍 Cách 1: Kiểm tra qua API Endpoint (Nhanh nhất)

### Bước 1: Gọi endpoint
```bash
GET http://localhost:5000/api/gemini-usage
```

### Bước 2: Xem kết quả
Response sẽ hiển thị:
- `instanceId`: ID duy nhất của instance hiện tại (format: `hostname-processId-timestamp`)
- `processId`: Process ID
- `hostname`: Tên máy chủ
- `apiKeyHash`: Hash của API key (để detect nếu có nhiều instance dùng cùng key)
- `requestsInLastMinute`: Số requests trong 1 phút qua
- `consecutive503Errors`: Số lỗi 503 liên tiếp
- `isCircuitOpen`: Circuit breaker có đang mở không

### Bước 3: Phân tích kết quả

**Ví dụ kết quả:**
```json
{
  "instanceId": "SadBoizz-19160-1766067263994",
  "processId": 19160,
  "hostname": "SadBoizz",
  "apiKeyHash": "AIzaSyBPZU...0rXE",
  "requestsInLastMinute": 0,
  "maxRpmLimit": 3,
  "consecutive503Errors": 0,
  "isCircuitOpen": false
}
```

**Cách đọc:**
- ✅ `instanceId` duy nhất → Chỉ có 1 instance đang chạy
- ✅ `consecutive503Errors: 0` → Không có lỗi 503 gần đây
- ✅ `isCircuitOpen: false` → Circuit breaker đang đóng (bình thường)
- ⚠️ Nếu thấy nhiều `instanceId` khác nhau trong logs → Có nhiều instance

### Bước 4: So sánh với các instance khác
- Nếu bạn có nhiều server/process, gọi endpoint này trên mỗi instance
- So sánh `instanceId` và `apiKeyHash`
- Nếu `apiKeyHash` giống nhau nhưng `instanceId` khác nhau → **CÓ NHIỀU INSTANCE DÙNG CÙNG API KEY**

### Bước 5: Kiểm tra các process đang chạy
```bash
# Windows (PowerShell)
Get-Process node | Where-Object {$_.Path -like "*node*"}

# Linux/Mac
ps aux | grep node
```

Nếu thấy nhiều process Node.js đang chạy → Có thể có nhiều instance

---

## 🔍 Cách 2: Kiểm tra trong Server Logs

### Bước 1: Xem logs khi server khởi động
Khi server khởi động, bạn sẽ thấy log:
```
✅ Google Gemini AI initialized (Model: gemini-2.5-flash)
   Instance ID: hostname-12345-1234567890
   Process ID: 12345
   Hostname: your-hostname
   API Key: AIzaSyAbc...xyz1
   ⚠️  If multiple instances use the same API key, rate limits will be shared!
```

### Bước 2: So sánh logs từ các instance
- Nếu thấy nhiều `Instance ID` khác nhau nhưng `API Key` giống nhau → **CÓ NHIỀU INSTANCE**

---

## 🔍 Cách 3: Kiểm tra trong Google Cloud Console (Chính xác nhất)

### Bước 1: Truy cập Google Cloud Console
1. Đăng nhập vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn

### Bước 2: Xem API Credentials
1. Vào **APIs & Services** > **Credentials**
2. Tìm API key của bạn (Gemini API Key)
3. Click vào API key để xem chi tiết

### Bước 3: Xem Usage/Quotas
1. Trong trang API key, tìm tab **Usage** hoặc **Quotas**
2. Xem số lượng requests trong thời gian gần đây
3. Nếu số requests > số requests từ instance của bạn → **CÓ INSTANCE KHÁC ĐANG DÙNG**

### Bước 4: Xem Application Restrictions
1. Trong trang API key, xem **Application restrictions**
2. Nếu có nhiều IP addresses hoặc referrers → **CÓ NHIỀU INSTANCE**

---

## 🔍 Cách 4: Kiểm tra Environment Variables

### Bước 1: Kiểm tra file .env
```bash
# Trong mỗi instance/server, kiểm tra:
cat .env | grep GEMINI_API_KEY
```

### Bước 2: So sánh các instance
- Nếu tất cả instance có cùng `GEMINI_API_KEY` → **CÓ NHIỀU INSTANCE DÙNG CÙNG KEY**

### Bước 3: Kiểm tra trong code
```bash
# Tìm tất cả nơi sử dụng GEMINI_API_KEY
grep -r "GEMINI_API_KEY" Backend_ReactSinglepage/
```

---

## ⚠️ Dấu hiệu có nhiều instance dùng cùng API key

1. **Lỗi 503 thường xuyên** mặc dù rate limit đã được giảm
2. **Requests bị reject** ngay cả khi instance hiện tại chưa đạt limit
3. **Logs hiển thị nhiều instanceId khác nhau** nhưng cùng apiKeyHash
4. **Google Cloud Console** hiển thị nhiều requests hơn số requests từ instance của bạn

---

## ✅ Giải pháp nếu phát hiện nhiều instance

### Giải pháp 1: Tách API keys (Khuyến nghị)
- Tạo API key riêng cho mỗi instance
- Cập nhật `.env` của mỗi instance với API key riêng

### Giải pháp 2: Giảm rate limit hơn nữa
- Nếu có 2 instances: Giảm xuống 2 RPM (30s delay)
- Nếu có 3 instances: Giảm xuống 1 RPM (60s delay)

### Giải pháp 3: Implement shared rate limiter
- Sử dụng Redis hoặc database để share rate limit state
- Tất cả instances check cùng một counter

### Giải pháp 4: Upgrade API tier
- Nếu có budget, upgrade lên paid tier để có rate limit cao hơn

---

## 📊 Monitoring

### Thêm vào monitoring system:
```javascript
// Gọi endpoint này định kỳ để monitor
setInterval(async () => {
  const stats = await fetch('/api/gemini-usage').then(r => r.json());
  console.log('Gemini API Stats:', stats);
}, 60000); // Mỗi phút
```

---

## 🔗 Links hữu ích

- [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials)
- [Gemini API Quotas](https://ai.google.dev/pricing)
- [Rate Limiting Best Practices](https://cloud.google.com/apis/design/rate_limiting)

