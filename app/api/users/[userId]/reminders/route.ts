import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReminderRequestBody = {
  type: string;
  message: string;
  frequency: string;
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

    const body: ReminderRequestBody = await request.json();
    const { type, message, frequency } = body;

    if (!type || !message || !frequency) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        type,
        message,
        frequency,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder created successfully!',
      data: {
        id: reminder.id,
        type: reminder.type,
        userId: reminder.userId,
        message: reminder.message,
        createdAt: reminder.createdAt.toISOString(),
        frequency: reminder.frequency,
        updatedAt: reminder.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating reminder:', error);
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

    const reminders = await prisma.reminder.findMany({
      where: { userId: userId },
      select: {
        id: true,
        type: true,
        userId: true,
        message: true,
        createdAt: true,
        frequency: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminders fetched successfully!',
      data: reminders,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}