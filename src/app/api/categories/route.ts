import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { exams: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET MERCH ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách danh mục" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Tên danh mục là bắt buộc" }, { status: 400 });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Tên danh mục đã tồn tại" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST CATEGORY ERROR:", error);
    return NextResponse.json({ error: "Lỗi khi tạo danh mục" }, { status: 500 });
  }
}
