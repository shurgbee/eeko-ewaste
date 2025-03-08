"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, HelpCircle, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChatWithAI } from "@/components/chat-with-ai"
import { useToast } from "@/hooks/use-toast"

const eWasteCategories = [
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

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>

export function Submission() {
  const { toast } = useToast()
  const [showAIChat, setShowAIChat] = useState(false)
  const [suggestedPickupDates, setSuggestedPickupDates] = useState<Date[]>([
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  ])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      items: [{ category: "", quantity: 1, description: "" }],
    },
  })

  function onSubmit(data: FormValues) {
    // In a real app, this would send the data to the server
    console.log(data.items[0].category)

    if (data.items[0].category == "") {
      toast({
        title: "Submission unsuccessful",
        description: "Please include a valid e-waste item"
      })
    } else {
      // Show success message
      toast({
        title: "Submission successful!",
        description: `Your e-waste pickup is scheduled for ${format(data.pickupDate, "PPP")}`,
      })
    }
      
  }

  const addItem = () => {
    const currentItems = form.getValues("items") || []
    form.setValue("items", [...currentItems, { category: "", quantity: 1, description: "" }])
  }

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items")
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>E-Waste Submission Form</span>
            <Button variant="outline" onClick={() => setShowAIChat(true)} className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Need Help?</span>
            </Button>
          </CardTitle>
          <CardDescription>Fill out this form to schedule an e-waste pickup</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">E-Waste Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>

                {form.watch("items").map((_, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={form.watch("items").length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {eWasteCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the item (brand, model, condition, etc.)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="pickupDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pickup Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={
                            (date) =>
                              date < new Date() || // Can't select dates in the past
                              date.getDay() === 0 || // Can't select Sundays
                              date.getDay() === 6 // Can't select Saturdays
                          }
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <h4 className="mb-2 text-sm font-medium">Suggested pickup dates:</h4>
                          <div className="flex flex-wrap gap-2">
                            {suggestedPickupDates.map((date, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange(date)}
                                className={`text-xs ${
                                  field.value && format(field.value, "PPP") === format(date, "PPP")
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : ""
                                }`}
                              >
                                {format(date, "M/d/yy")}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a preferred date for pickup. Our team will confirm the time.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
            <DialogDescription>
              I can help you fill out the e-waste submission form. What would you like to know?
            </DialogDescription>
          </DialogHeader>
          <ChatWithAI />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIChat(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

