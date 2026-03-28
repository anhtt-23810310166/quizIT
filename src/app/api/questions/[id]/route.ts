import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const { examId, content, type, options, correctOption } = body;

    if (!examId || !content || !options || options.length < 2 || correctOption === undefined) {
       return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin câu hỏi và ít nhất 2 đáp án" }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        examId,
        content,
        type,
        options: JSON.stringify(options),
        correctOption: Number(correctOption)
      },
      include: {
        exam: { select: { title: true } }
      }
    });

    return NextResponse.json({
      ...updatedQuestion,
      options: JSON.parse(updatedQuestion.options)
    });
  } catch (error: any) {
    console.error("PUT QUESTION ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật câu hỏi", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Xóa câu hỏi thành công" });
  } catch (error: any) {
    console.error("DELETE QUESTION ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi xóa câu hỏi", details: error.message }, { status: 500 });
  }
}
