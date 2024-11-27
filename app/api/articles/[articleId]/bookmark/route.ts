import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { articleId: string, userId: string } }
) {
  try {
    const articleId = parseInt(params.articleId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(articleId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid article ID or user ID' }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await prisma.bookmark.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Article bookmarked successfully!',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error bookmarking article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}