import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const qnaSessions = await prisma.qnASession.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        scheduledDate: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Q&A sessions fetched successfully!",
      data: qnaSessions,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error fetching Q&A sessions",
    }, { status: 500 });
  }
}