import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await prisma.result.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        exam: {
          select: {
            title: true,
            duration: true,
            category: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("FETCH MY EXAMS ERROR:", error);
    return NextResponse.json({ error: "Lỗi trong quá trình lấy lịch sử thi" }, { status: 500 });
  }
}
