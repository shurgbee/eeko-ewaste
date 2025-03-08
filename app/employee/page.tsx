import { EmployeeLogin } from "@/components/employee-login"

export const metadata = {
  title: "Employee Portal | Eeko",
  description: "Eeko employee portal for managing e-waste pickups.",
}

export default function EmployeePage() {
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Employee Portal</h1>
        <EmployeeLogin />
      </div>
    </div>
  )
}

