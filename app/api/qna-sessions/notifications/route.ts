import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from "@/lib/email-service";

export async function POST(request: Request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
      },
    });

    const emailPromises = users.map(user => {
      return sendEmail({
        to: user.email,
        template: {
          subject: "Upcoming Q&A Session Notification",
          html: "<p>Dear User, don't miss our upcoming Q&A sessions!</p>",
          text: "Dear User, don't miss our upcoming Q&A sessions!",
        },
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: "Notifications for upcoming Q&A sessions sent successfully!",
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error sending notifications:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}