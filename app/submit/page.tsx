import { Submission } from "@/components/submission-form"

export const metadata = {
  title: "Submit E-Waste | Eeko",
  description: "Submit your e-waste for collection by Eeko.",
}

export default function SubmitPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit Your E-Waste</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Please fill out the form below to register your e-waste for collection. If you need help, you can use our AI
          assistant to guide you through the process.
        </p>
        <Submission />
      </div>
    </div>
  )
}

