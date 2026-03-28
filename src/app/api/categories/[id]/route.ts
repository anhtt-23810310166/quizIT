import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Tên danh mục là bắt buộc" }, { status: 400 });
    }

    // Check if new name already exists in another category
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name,
        id: { not: id } 
      },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Tên danh mục đã tồn tại" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error("PUT CATEGORY ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật danh mục", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;

    // Optional: Check if category has exams before deleting, 
    // or rely on Cascade delete from Prisma (currently set to Cascade in schema)
    const examCount = await prisma.exam.count({
      where: { categoryId: id }
    });
    
    // We can block deletion if there are exams to be safe
    if (examCount > 0) {
      return NextResponse.json(
        { error: "Không thể xóa danh mục đang có đề thi. Vui lòng chuyển các đề thi sang danh mục khác trước." }, 
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Xóa danh mục thành công" });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi xóa danh mục", details: (error as Error).message }, { status: 500 });
  }
}
