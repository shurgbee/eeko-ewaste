import { z } from "zod"

export const eWasteCategories = [
  "Large household appliances",
  "Small household appliances",
  "IT equipment",
  "Consumer electronics",
  "Lamps and luminaires",
  "Toys",
  "Tools",
  "Medical devices",
  "Monitoring and control instruments",
  "Automatic dispensers",
]

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  pickupDate: z.date({
    required_error: "Please select a pickup date.",
  }),
  items: z
    .array(
      z.object({
        category: z.string().min(1,{
          message: "Please select a category.",
        }),
        quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
        description: z.string().optional(),
      }),
    )
    .min(1, { message: "Please add at least one item." }),
})

export type FormValues = z.infer<typeof formSchema>
