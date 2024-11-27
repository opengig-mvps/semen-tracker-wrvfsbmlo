import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ForumPostRequestBody = {
  content: string;
};

export async function POST(request: Request) {
  try {
    const body: ForumPostRequestBody = await request.json();
    const { content } = body;
    if (!content) {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    const userId = 1;

    const forumPost = await prisma.forumPost.create({
      data: {
        userId,
        content,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Forum post created successfully!',
      data: {
        id: forumPost.id,
        userId: forumPost.userId,
        content: forumPost.content,
        createdAt: forumPost.createdAt.toISOString(),
        updatedAt: forumPost.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating forum post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const forumPosts = await prisma.forumPost.findMany({
      include: {
        replies: {
          select: {
            id: true,
            userId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            forumPostId: true,
          },
        },
      },
    });

    const formattedPosts = forumPosts.map(post => ({
      id: post.id,
      userId: post.userId,
      content: post.content,
      replies: post.replies.map(reply => ({
        id: reply.id,
        userId: reply.userId,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
        forumPostId: reply.forumPostId,
      })),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: "Forum posts fetched successfully!",
      data: formattedPosts,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json({
      success: false,
      message: "Error while fetching forum posts",
    }, { status: 500 });
  }
}