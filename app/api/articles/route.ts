import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keywords = searchParams.get('keywords');

    const articles = await prisma.article.findMany({
      where: {
        AND: [
          category ? { category: category } : {},
          keywords ? { title: { contains: keywords } } : {},
        ],
      },
      select: {
        id: true,
        title: true,
        author: true,
        publicationDate: true,
      },
    });

    const formattedArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      author: article.author,
      publicationDate: article.publicationDate.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: 'Articles fetched successfully!',
      data: formattedArticles,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}