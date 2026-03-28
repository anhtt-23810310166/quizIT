import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const { title, description, duration, categoryId, status } = body;

    if (!title || !duration || !categoryId) {
      return NextResponse.json({ error: "Tiêu đề, Thời gian thi và Danh mục là bắt buộc" }, { status: 400 });
    }

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title,
        description,
        duration: parseInt(duration),
        categoryId,
        status,
      },
      include: {
        category: { select: { name: true } }
      }
    });

    return NextResponse.json(updatedExam);
  } catch (error: any) {
    console.error("PUT EXAM ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật đề thi", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    await prisma.exam.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Xóa đề thi thành công" });
  } catch (error) {
    console.error("DELETE EXAM ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi xóa đề thi", details: (error as Error).message }, { status: 500 });
  }
}
