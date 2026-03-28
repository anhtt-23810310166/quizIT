import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { name: true }
        },
        _count: {
          select: { questions: true }
        }
      }
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("GET EXAMS ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách đề thi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, duration, categoryId, status } = body;

    if (!title || !duration || !categoryId) {
      return NextResponse.json({ error: "Tiêu đề, Thời gian thi và Danh mục là bắt buộc" }, { status: 400 });
    }

    const newExam = await prisma.exam.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        categoryId,
        status: status || "DRAFT"
      },
      include: {
        category: { select: { name: true } }
      }
    });

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error("POST EXAM ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi tạo đề thi" }, { status: 500 });
  }
}
