import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    
    // Fetch Exam metadata
    const exam = await prisma.exam.findFirst({
      where: { 
        id,
        status: "PUBLISHED" 
      },
      include: {
        category: { select: { name: true } }
      }
    });

    if (!exam) {
      return NextResponse.json({ error: "Không tìm thấy đề thi hoặc đề thi chưa được xuất bản" }, { status: 404 });
    }

    const questions = await prisma.question.findMany({
      where: { examId: id }
    });

    const formattedQuestions = questions.map((q: any) => ({
       id: q.id,
       content: q.content,
       type: q.type,
       options: JSON.parse(q.options)
    }));

    return NextResponse.json({
       ...exam,
       questions: formattedQuestions
    });
  } catch (error: any) {
    console.error("GET CLIENT EXAM DETAIL ERROR:", error);
    return NextResponse.json({ error: "Lỗi tải nội dung đề thi", details: error.message }, { status: 500 });
  }
}
