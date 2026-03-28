import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Không có quyền truy cập. Vui lòng đăng nhập!" }, { status: 401 });
    }

    const examId = (await params).id;
    const body = await req.json();
    const { answers } = body; 

    if (!answers) {
       return NextResponse.json({ error: "Thiếu dữ liệu bài làm." }, { status: 400 });
    }

    const exam = await prisma.exam.findFirst({
      where: { id: examId },
      include: { questions: true }
    });

    if (!exam) {
      return NextResponse.json({ error: "Không tìm thấy đề thi" }, { status: 404 });
    }

    let totalCorrect = 0;
    const totalQuestions = exam.questions.length;

    exam.questions.forEach((q: { id: string; correctOption: number }) => {
       const userChoice = answers[q.id];
       if (userChoice !== undefined && userChoice === q.correctOption) {
          totalCorrect++;
       }
    });

    const score = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 10 : 0;

    const result = await prisma.result.create({
       data: {
         userId: session.user.id,
         examId: exam.id,
         score: parseFloat(score.toFixed(2)),
         totalCorrect,
         totalAnswers: totalQuestions,
         answers: JSON.stringify(answers)
       }
    });

    return NextResponse.json({ 
       message: "Nộp bài thành công",
       resultId: result.id
    }, { status: 201 });

  } catch (error: any) {
    console.error("SUBMIT EXAM ERROR:", error);
    return NextResponse.json({ error: "Lỗi trong quá trình chấm điểm", details: error.message }, { status: 500 });
  }
}
