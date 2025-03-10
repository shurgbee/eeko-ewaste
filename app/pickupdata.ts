"use server"
import { PrismaClient } from '@prisma/client';
import { FormValues } from '@/types/submission';

const prisma = new PrismaClient();

export async function submit(data: FormValues) {
  try {
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
          create: data.items.map((item) => ({
            category: item.category,
            quantity: item.quantity,
            description: item.description || '',
          })),
        },
      },
    });

    return { success: true, ok: true };
  } catch (error) {
    console.error('Error saving submission:', error);
    return { success: false , ok: false };
  } finally {
    await prisma.$disconnect();
  }
}

//we may have params for this function one day with specific acc requirements.
export async function hydrateDashboard(){
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

    return {success: true, data: submissions};
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false};
  } finally {
    await prisma.$disconnect();
  }
}