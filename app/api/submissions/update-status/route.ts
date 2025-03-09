import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Submission ID and status are required' },
        { status: 400 }
      );
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ submission: updatedSubmission });
  } catch (error) {
    console.error('Error updating submission status:', error);
    return NextResponse.json({ error: 'Failed to update submission status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}