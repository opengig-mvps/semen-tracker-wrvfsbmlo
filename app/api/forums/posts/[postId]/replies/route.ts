import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReplyRequestBody = {
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, message: 'Invalid post ID' }, { status: 400 });
    }

    const body: ReplyRequestBody = await request.json();
    const { content } = body;
    if (!content) {
      return NextResponse.json({ success: false, message: 'Missing content' }, { status: 400 });
    }

    const userId = 1;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        userId,
        forumPostId: postId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reply posted successfully!',
      data: {
        id: reply.id,
        userId: reply.userId,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
        forumPostId: reply.forumPostId,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error posting reply:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}