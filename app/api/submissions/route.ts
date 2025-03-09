import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Create the submission in the database
    const submission = await prisma.submission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        pickupDate: data.pickupDate,
        // Create related items
        items: {
          create: data.items.map((item: any) => ({
            category: item.category,
            quantity: item.quantity,
            description: item.description || '',
          })),
        },
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
