import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        exam: {
          select: { title: true }
        }
      }
    });

    const formattedQuestions = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    console.error("GET QUESTIONS ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách câu hỏi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examId, content, type, options, correctOption } = body;

    if (!examId || !content || !options || options.length < 2 || correctOption === undefined) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin câu hỏi và ít nhất 2 đáp án" }, { status: 400 });
    }

    const newQuestion = await prisma.question.create({
      data: {
        examId,
        content,
        type: type || "SINGLE_CHOICE",
        options: JSON.stringify(options),
        correctOption: Number(correctOption)
      },
      include: {
        exam: { select: { title: true } }
      }
    });

    return NextResponse.json({
      ...newQuestion,
      options: JSON.parse(newQuestion.options)
    }, { status: 201 });
  } catch (error) {
    console.error("POST QUESTION ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi tạo câu hỏi" }, { status: 500 });
  }
}
