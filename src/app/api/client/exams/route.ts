import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// API cho Học viên xem các đề thi đã PUBLISHED
export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        status: "PUBLISHED"
      },
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
    console.error("GET CLIENT EXAMS ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách đề thi" }, { status: 500 });
  }
}
