# QuizIT - Hệ thống thi trắc nghiệm trực tuyến

Dự án được xây dựng bằng Next.js 15, Tailwind CSS và Prisma (SQLite).

## 📂 Cấu trúc thư mục dự án

```text
quizIT/
├── prisma/             # Cấu hình cơ sở dữ liệu (Schema và Seed dữ liệu)
├── public/             # Các tệp tĩnh (Images, SVGs, Favicon)
├── src/                # Mã nguồn chính
│   ├── app/            # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (admin)/    # Các trang quản trị (Dashboard, Categories, Questions...)
│   │   ├── (auth)/     # Các trang xác thực (Login, Register)
│   │   ├── (client)/   # Các trang dành cho học viên (Exams, Results)
│   │   └── api/        # Các API Endpoints xử lý logic backend
│   ├── components/     # Các thành phần giao diện tái sử dụng (Sidebar, Providers)
│   ├── lib/            # Cấu hình thư viện (Prisma Client, NextAuth)
│   └── types/          # Định nghĩa kiểu dữ liệu TypeScript
├── .env                # Biến môi trường (DATABASE_URL, AUTH_SECRET)
├── run.bat             # File thực thi nhanh để cài đặt và chạy trên Windows
├── seed.ts             # Script nạp dữ liệu mẫu ban đầu
├── tailwind.config.ts  # Cấu hình giao diện Tailwind CSS
└── tsconfig.json       # Cấu hình TypeScript
```

## 🚀 Hướng dẫn cài đặt nhanh (Windows)

Nếu bạn sử dụng Windows, chỉ cần chạy file **`run.bat`**. File này sẽ tự động:
1. Cài đặt thư viện (`npm install`).
2. Khởi tạo Database (`npx prisma generate/push`).
3. Nạp dữ liệu mẫu (`npx tsx seed.ts`).
4. Khởi động server (`npm run dev`).

## 🛠 Cài đặt thủ công (Mac/Linux/Windows)

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình file `.env`:**
   Đảm bảo file `.env` có nội dung sau:
   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="your-secret-key-12345"
   ```

3. **Khởi tạo và Seed Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx seed.ts
   ```

4. **Chạy dự án:**
   ```bash
   npm run dev
   ```
   Truy cập tại: `http://localhost:3000`

## 🔐 Thông tin đăng nhập mẫu

Sau khi chạy lệnh Seed, bạn có thể dùng các tài khoản sau:

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Admin** | `admin@quizit.com` | `admin123` |
| **Học viên** | `user@quizit.com` | `user123` |

## ✨ Công nghệ sử dụng

- **Frontend:** Next.js 15, Tailwind CSS, Lucide Icons.
- **Backend:** Next.js API Routes, NextAuth.js v5.
- **Database:** SQLite với Prisma ORM.
- **State Management:** Zustand.
