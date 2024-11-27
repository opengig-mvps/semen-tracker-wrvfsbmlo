import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReminderRequestBody = {
  type: string;
  message: string;
  frequency: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; reminderId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const reminderId = parseInt(params.reminderId, 10);

    if (isNaN(userId) || isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or reminder ID' }, { status: 400 });
    }

    const body: ReminderRequestBody = await request.json();

    const { type, message, frequency } = body;
    if (!type || !message || !frequency) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedReminder = await prisma.reminder.updateMany({
      where: { id: reminderId, userId: userId },
      data: {
        type,
        message,
        frequency,
        updatedAt: new Date(),
      },
    });

    if (updatedReminder.count === 0) {
      return NextResponse.json({ success: false, message: 'Reminder not found or not updated' }, { status: 404 });
    }

    const reminder = await prisma.reminder.findFirst({
      where: { id: reminderId, userId: userId },
    });

    if (!reminder) {
      return NextResponse.json({ success: false, message: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder updated successfully!',
      data: {
        id: reminder.id,
        type: reminder.type,
        userId: reminder.userId,
        message: reminder.message,
        createdAt: reminder.createdAt.toISOString(),
        frequency: reminder.frequency,
        updatedAt: reminder.updatedAt.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string, reminderId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const reminderId = parseInt(params.reminderId, 10);

    if (isNaN(userId) || isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or reminder ID' }, { status: 400 });
    }

    const reminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId: userId,
      },
    });

    if (!reminder) {
      return NextResponse.json({ success: false, message: 'Reminder not found' }, { status: 404 });
    }

    await prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully!',
      data: {
        id: reminder.id,
        type: reminder.type,
        userId: reminder.userId,
        message: reminder.message,
        createdAt: reminder.createdAt.toISOString(),
        frequency: reminder.frequency,
        updatedAt: reminder.updatedAt.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}