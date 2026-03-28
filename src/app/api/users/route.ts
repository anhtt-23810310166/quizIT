import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
export async function GET() {
  try {
    const session = await auth();
    // Chặn nếu không phải ADMIN
    if (session?.user?.role !== "ADMIN") {
       return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
         id: true,
         name: true,
         email: true,
         role: true,
         createdAt: true,
         // Đếm số bài thi user đã tham gia
         _count: {
            select: { results: true }
         }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("FETCH USERS ERROR:", error);
    return NextResponse.json({ error: "Lỗi lấy danh sách người dùng" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Chặn nếu không phải ADMIN
    if (session?.user?.role !== "ADMIN") {
       return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Tên và Email là bắt buộc" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email này đã được sử dụng" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Construct response to match GET endpoint format (includes _count for UI rendering)
    return NextResponse.json({
        ...userWithoutPassword,
        _count: { results: 0 } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi tạo người dùng", details: error.message }, { status: 500 });
  }
}
