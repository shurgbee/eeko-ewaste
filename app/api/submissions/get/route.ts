import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        items: true,
      },
      orderBy: {
        pickupDate: 'asc',
      },
    });
    console.log(submissions)

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
