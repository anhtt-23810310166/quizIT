import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
       return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const id = (await params).id;
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Tên và Email là bắt buộc" }, { status: 400 });
    }

    // Check email trùng lặp với user khác
    const existingUser = await prisma.user.findFirst({
      where: { 
        email,
        id: { not: id } 
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email này đã được sử dụng" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
      },
      select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
             select: { results: true }
          }
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PUT USER ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật người dùng", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
       return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const id = (await params).id;

    // Ngăn chặn xóa chính mình
    if (id === session.user.id) {
       return NextResponse.json({ error: "Không thể tự xóa tài khoản của chính mình" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Xóa người dùng thành công" });
  } catch (error: any) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi xóa người dùng", details: error.message }, { status: 500 });
  }
}
