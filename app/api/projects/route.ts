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

// Projeleri getir
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

// Proje oluştur
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });

  const { name, description, color } = await req.json();
  if (!name) return NextResponse.json({ message: "Proje adı zorunludur." }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      name,
      description,
      color: color || "#00E5A0",
      ownerId: userId,
      columns: {
        create: [
          { name: "Yapılacak", order: 0 },
          { name: "Devam Ediyor", order: 1 },
          { name: "Test", order: 2 },
          { name: "Tamamlandı", order: 3 },
        ],
      },
    },
  });

  return NextResponse.json(project, { status: 201 });
}