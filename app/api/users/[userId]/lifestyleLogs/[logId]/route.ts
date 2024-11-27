import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type LifestyleLogRequestBody = {
  diet: string;
  exercise: string;
  sleepHours: number;
};

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string; logId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const logId = parseInt(params.logId, 10);

    if (isNaN(userId) || isNaN(logId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or log ID' }, { status: 400 });
    }

    const body: LifestyleLogRequestBody = await request.json();

    const { diet, exercise, sleepHours } = body;

    const lifestyleLog = await prisma.lifestyleLog.findFirst({
      where: {
        id: logId,
        userId: userId,
      },
    });

    if (!lifestyleLog) {
      return NextResponse.json({ success: false, message: 'Lifestyle log not found' }, { status: 404 });
    }

    const updatedLifestyleLog = await prisma.lifestyleLog.update({
      where: {
        id: logId,
      },
      data: {
        diet,
        exercise,
        sleepHours,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lifestyle log updated successfully!',
      data: updatedLifestyleLog,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating lifestyle log:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; logId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const logId = parseInt(params.logId, 10);

    if (isNaN(userId) || isNaN(logId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or log ID' }, { status: 400 });
    }

    const lifestyleLog = await prisma.lifestyleLog.findFirst({
      where: { id: logId, userId: userId },
    });

    if (!lifestyleLog) {
      return NextResponse.json({ success: false, message: 'Lifestyle log not found' }, { status: 404 });
    }

    await prisma.lifestyleLog.delete({
      where: { id: logId },
    });

    return NextResponse.json({
      success: true,
      message: 'Lifestyle log deleted successfully!',
      data: {
        id: lifestyleLog.id,
        date: lifestyleLog.date.toISOString(),
        diet: lifestyleLog.diet,
        userId: lifestyleLog.userId,
        exercise: lifestyleLog.exercise,
        createdAt: lifestyleLog.createdAt.toISOString(),
        updatedAt: lifestyleLog.updatedAt.toISOString(),
        sleepHours: lifestyleLog.sleepHours,
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}