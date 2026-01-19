# Ứng dụng Quản Lý Chi Phí Sinh Hoạt Chung

Ứng dụng web để quản lý và tính toán chi phí sinh hoạt hàng tháng cho nhóm.

## 🚀 Tính Năng

- ✅ Thêm, sửa, xóa chi phí
- ✅ Quản lý thành viên nhóm
- ✅ Tính toán chi phí theo tháng
- ✅ Hiển thị ai còn phải đóng bao nhiêu
- ✅ Giao diện tiếng Việt

## 📋 Yêu Cầu

- Node.js 14+ 
- npm hoặc yarn

## 🛠️ Cài Đặt Và Chạy Locally

### 1. Clone repository
```bash
cd financial_management
```

### 2. Cài đặt dependencies
```bash
# Cài dependencies cho cả backend và frontend
npm install
```

### 3. Chạy ứng dụng
```bash
# Chạy cả backend (port 5000) và frontend (port 3000)
npm run dev
```

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:5000/api

### Chạy riêng lẻ:
```bash
# Chỉ backend
cd backend && npm install && npm run dev

# Chỉ frontend (terminal khác)
cd frontend && npm install && npm run dev
```

## 📦 Deploy Lên Vercel

### Phương Pháp 1: Deploy Backend lên Vercel

1. **Tạo `vercel.json` trong thư mục backend:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "PORT": "5000"
  }
}
```

2. **Login vào Vercel:**
```bash
npm install -g vercel
vercel login
```

3. **Deploy backend:**
```bash
cd backend
vercel --prod
```

Ghi nhớ URL của backend (ví dụ: `https://your-backend.vercel.app`)

### Phương Pháp 2: Deploy Frontend lên Vercel

1. **Tạo `.env.production` trong thư mục frontend:**
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

2. **Deploy frontend:**
```bash
cd frontend
vercel --prod
```

### Phương Pháp 3: Deploy cả 2 cùng lúc (Khuyến Nghị)

1. **Cấu trúc thư mục:**
```
financial_management/
├── backend/
├── frontend/
├── vercel.json
└── package.json
```

2. **Tạo `vercel.json` ở root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

3. **Deploy:**
```bash
vercel --prod
```

## 🔑 Biến Môi Trường

### Backend (.env)
```
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## 📊 Cấu Trúc Dự Án

```
financial_management/
├── backend/                 # Express API
│   ├── routes/
│   │   ├── expenses.js
│   │   ├── members.js
│   │   └── calculations.js
│   ├── models/
│   │   └── data.js
│   ├── server.js
│   └── package.json
├── frontend/               # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   │   └── SettlementTable.js
│   │   ├── pages/
│   │   │   └── Dashboard.js
│   │   ├── api.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔗 API Endpoints

- `GET /api/expenses` - Lấy tất cả chi phí
- `POST /api/expenses` - Thêm chi phí mới
- `PUT /api/expenses/:id` - Cập nhật chi phí
- `DELETE /api/expenses/:id` - Xóa chi phí
- `GET /api/members` - Lấy danh sách thành viên
- `POST /api/members` - Thêm thành viên mới
- `GET /api/calculations/monthly/:month` - Tính toán chi phí theo tháng
- `GET /api/calculations/summary/:month` - Tóm tắt chi phí tháng

## 🐛 Troubleshooting

**Lỗi CORS:**
- Backend đã cho phép CORS từ tất cả origin
- Nếu dùng domain khác, cập nhật `cors()` trong `backend/server.js`

**Frontend không kết nối API:**
- Kiểm tra biến `REACT_APP_API_URL` trong `.env.production`
- Đảm bảo backend đang chạy

**Deploy thất bại:**
- Kiểm tra Node.js version: `node --version`
- Xóa `node_modules` và cài lại: `npm install`

## 📝 License

MIT

## 👥 Support

Liên hệ để được hỗ trợ!
