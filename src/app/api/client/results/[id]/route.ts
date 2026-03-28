import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resultId = (await params).id;

    if (!resultId) {
       return NextResponse.json({ error: "Missing result ID" }, { status: 400 });
    }

    const result = await prisma.result.findFirst({
      where: { id: resultId },
      include: {
        exam: {
           include: { category: true }
        },
        user: {
           select: { name: true, email: true }
        }
      }
    });

    if (!result) {
       return NextResponse.json({ error: "Không tìm thấy kết quả" }, { status: 404 });
    }

    if (result.userId !== session.user.id) {
       return NextResponse.json({ error: "Bạn không có quyền xem kết quả này" }, { status: 403 });
    }

    return NextResponse.json({
       ...result,
       answers: result.answers ? JSON.parse(result.answers) : {}
    });
  } catch (error) {
    console.error("FETCH RESULT ERROR:", error);
    return NextResponse.json({ error: "Lỗi trong quá trình lấy kết quả" }, { status: 500 });
  }
}
