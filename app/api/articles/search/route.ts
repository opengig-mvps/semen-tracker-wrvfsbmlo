import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword } = body;

    // Fetch articles that match the search query
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { author: { contains: keyword, mode: 'insensitive' } },
          { category: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        author: true,
        publicationDate: true,
      },
    });

    // Return the articles in the desired response format
    return NextResponse.json({
      success: true,
      message: 'Articles searched successfully!',
      data: articles,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error searching articles:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}