import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type LifestyleLogRequestBody = {
  date: string;
  diet: string;
  exercise: string;
  sleepHours: number;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: LifestyleLogRequestBody = await request.json();

    const { date, diet, exercise, sleepHours } = body;
    if (!date || !diet || !exercise || sleepHours === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const lifestyleLog = await prisma.lifestyleLog.create({
      data: {
        userId,
        date: new Date(date),
        diet,
        exercise,
        sleepHours,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lifestyle log created successfully!',
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
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating lifestyle log:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const lifestyleLogs = await prisma.lifestyleLog.findMany({
      where: { userId },
      select: {
        id: true,
        date: true,
        diet: true,
        exercise: true,
        sleepHours: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lifestyle logs fetched successfully!',
      data: lifestyleLogs,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching lifestyle logs:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}