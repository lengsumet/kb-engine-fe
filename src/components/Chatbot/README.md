# Chatbot Component

Mini chatbot widget ที่ลอยอยู่มุมขวาล่างของหน้าจอ

## คุณสมบัติ

- ✅ ปุ่มกลมลอยอยู่มุมขวาล่าง (fixed position)
- ✅ เปิด/ปิดหน้าต่างแชท
- ✅ ส่งข้อความและรับ response จาก API
- ✅ แสดง loading animation ขณะรอ response
- ✅ นับจำนวนตัวอักษร (0/2500)
- ✅ Responsive design

## การใช้งาน

```jsx
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  return (
    <div>
      {/* เนื้อหาหน้าเว็บของคุณ */}
      <Chatbot apiEndpoint="/api/chat" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiEndpoint | string | '/api/chat' | URL ของ API endpoint สำหรับส่งข้อความ |

## API Request Format

Chatbot จะส่ง POST request ไปยัง API endpoint ในรูปแบบ:

```json
{
  "message": "ข้อความที่ผู้ใช้พิมพ์"
}
```

## API Response Format

API ควร response กลับมาในรูปแบบ:

```json
{
  "response": "คำตอบจาก chatbot"
}
```

หรือ

```json
{
  "message": "คำตอบจาก chatbot"
}
```

## ตัวอย่าง API Backend (Node.js/Express)

```javascript
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    // เรียก AI API หรือ logic ของคุณ
    const response = await yourChatbotLogic(message);
    
    res.json({
      response: response
    });
  } catch (error) {
    res.status(500).json({
      response: 'ขออภัย เกิดข้อผิดพลาด'
    });
  }
});
```

## Customization

คุณสามารถปรับแต่งสีและสไตล์ได้ที่ `Chatbot.css`:

- สีหลัก: `#5dd9c1` และ `#4bc9b0`
- ขนาดหน้าต่าง: 380px x 600px
- ตำแหน่ง: ขวาล่าง (bottom: 20px, right: 20px)
