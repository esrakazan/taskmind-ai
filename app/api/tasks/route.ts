import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "taskmind-secret"
);

async function getUserId(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

// Görevleri getir (proje bazlı)
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ message: "projectId zorunlu." }, { status: 400 });

  const columns = await prisma.column.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
    include: {
      tasks: {
        orderBy: { order: "asc" },
        include: { assignee: true, labels: true },
      },
    },
  });

  return NextResponse.json(columns);
}

// Görev oluştur
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });

  const { title, description, columnId, projectId, priority, dueDate } = await req.json();
  if (!title || !columnId || !projectId)
    return NextResponse.json({ message: "Zorunlu alanlar eksik." }, { status: 400 });

  const lastTask = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
  });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      columnId,
      projectId,
      priority: priority || "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      order: (lastTask?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(task, { status: 201 });
}

// Görev güncelle (kolon değişimi için)
export async function PATCH(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });

  const { taskId, columnId, order } = await req.json();
  if (!taskId) return NextResponse.json({ message: "taskId zorunlu." }, { status: 400 });

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(columnId && { columnId }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json(task);
}

// Görev sil
export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) return NextResponse.json({ message: "taskId zorunlu." }, { status: 400 });

  await prisma.task.delete({ where: { id: taskId } });
  return NextResponse.json({ message: "Silindi." });
}