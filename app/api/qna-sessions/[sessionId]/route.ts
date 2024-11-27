import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session ID' }, { status: 400 });
    }

    const session = await prisma.qnASession.findFirst({
      where: { id: sessionId },
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

    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Q&A session details fetched successfully!',
      data: session,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving Q&A session:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}