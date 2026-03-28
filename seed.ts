import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu khởi tạo dữ liệu mẫu...');

  // Xóa dữ liệu cũ (Tùy chọn, hiện tại bảng đang trống)
  await prisma.result.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Tạo tài khoản Admin & User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Quản Trị Viên',
      email: 'admin@quizit.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Học Viên A',
      email: 'user@quizit.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Đã tạo 2 Users: Admin & Học viên');

  // Tạo Danh mục
  const catReact = await prisma.category.create({
    data: {
      name: 'Lập trình ReactJS',
      description: 'Các bài thi liên quan đến React 19 và Component',
    },
  });

  const catNext = await prisma.category.create({
    data: {
      name: 'Lập trình Next.js',
      description: 'App Router, Turbopack, SSR, API Routes',
    },
  });
  console.log('Đã tạo 2 Danh mục');

  // Tạo Đề thi
  const exam = await prisma.exam.create({
    data: {
      title: 'Bài thi thử: Kiến thức React cơ bản',
      description: 'Kiểm tra mức độ hiểu biết về React Hook và JSX',
      duration: 15,
      status: 'PUBLISHED',
      categoryId: catReact.id,
    },
  });
  console.log('Đã tạo 1 Đề thi');

  // Tạo Câu hỏi
  await prisma.question.createMany({
    data: [
      {
        examId: exam.id,
        content: 'Hook nào sau đây được dùng để quản lý state trong React Component?',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify(['useEffect', 'useContext', 'useState', 'useReducer']),
        correctOption: 2,
      },
      {
        examId: exam.id,
        content: 'JSX là viết tắt của từ gì?',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify([
          'JavaScript XML',
          'Java Syntax Extension',
          'JavaScript Extension',
          'JSON XML',
        ]),
        correctOption: 0,
      },
    ],
  });
  console.log('Đã tạo Câu hỏi cho Đề thi');

  console.log('Hoàn tất nạp dữ liệu! Vui lòng đăng nhập với admin@quizit.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
