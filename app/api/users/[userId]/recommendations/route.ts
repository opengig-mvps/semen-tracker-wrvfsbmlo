import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        semenReports: true,
        lifestyleLogs: true,
        healthRecommendations: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const recommendations = user.healthRecommendations.map((rec) => ({
      id: rec.id,
      createdAt: rec.createdAt.toISOString(),
      updatedAt: rec.updatedAt.toISOString(),
      recommendation: rec.recommendation,
    }));

    return NextResponse.json({
      success: true,
      message: 'Health recommendations fetched successfully!',
      data: recommendations,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}