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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const semenReports = await prisma.semenReport.findMany({
      where: { userId: userId },
      select: {
        date: true,
        count: true,
        motility: true,
        morphology: true,
      },
    });

    if (!semenReports.length) {
      return NextResponse.json({
        success: true,
        message: 'No semen reports found',
        data: {
          goals: { countGoal: 55, motilityGoal: 65, morphologyGoal: 75 },
          trends: { countTrend: 'stable', motilityTrend: 'stable', morphologyTrend: 'stable' },
          metrics: [],
        },
      }, { status: 200 });
    }

    const metrics = semenReports.map(report => ({
      date: report.date.toISOString(),
      count: report.count,
      motility: report.motility,
      morphology: report.morphology,
    }));

    const trends = {
      countTrend: 'increasing',
      motilityTrend: 'stable',
      morphologyTrend: 'decreasing',
    };

    const goals = {
      countGoal: 55,
      motilityGoal: 65,
      morphologyGoal: 75,
    };

    return NextResponse.json({
      success: true,
      message: 'Semen health metrics fetched successfully!',
      data: { goals, trends, metrics },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching semen reports:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}