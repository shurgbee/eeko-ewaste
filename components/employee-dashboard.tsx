"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, MapPin, Package, Truck, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const pickups = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St, Anytown, CA 12345",
    email: "john@example.com",
    phone: "(123) 456-7890",
    date: new Date(2025, 2, 10), // March 10, 2025
    status: "pending",
    items: [
      { category: "IT equipment", quantity: 2, description: "Old laptops" },
      { category: "Consumer electronics", quantity: 1, description: "32-inch TV" },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "456 Oak Ave, Somewhere, CA 54321",
    email: "jane@example.com",
    phone: "(987) 654-3210",
    date: new Date(2025, 2, 11), // March 11, 2025
    status: "pending",
    items: [{ category: "Large household appliances", quantity: 1, description: "Refrigerator" }],
  },
  {
    id: "3",
    name: "Bob Johnson",
    address: "789 Pine St, Nowhere, CA 67890",
    email: "bob@example.com",
    phone: "(555) 123-4567",
    date: new Date(2025, 2, 12), // March 12, 2025
    status: "pending",
    items: [
      { category: "Small household appliances", quantity: 3, description: "Microwave, toaster, blender" },
      { category: "Toys", quantity: 5, description: "Electronic toys" },
    ],
  },
]

export function EmployeeDashboard() {
  const [selectedPickup, setSelectedPickup] = useState<(typeof pickups)[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedPickups, setSelectedPickups] = useState<string[]>([])
  const [showRouteDialog, setShowRouteDialog] = useState(false)

  const handleSelectPickup = (id: string) => {
    if (selectedPickups.includes(id)) {
      setSelectedPickups(selectedPickups.filter((pickupId) => pickupId !== id))
    } else {
      setSelectedPickups([...selectedPickups, id])
    }
  }

  const handleViewDetails = (pickup: (typeof pickups)[0]) => {
    setSelectedPickup(pickup)
    setShowDetails(true)
  }

  const handleCreateRoute = () => {
    // In a real app, this would create a route with Google Maps
    setShowRouteDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <Button
          onClick={handleCreateRoute}
          disabled={selectedPickups.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <Truck className="mr-2 h-4 w-4" /> Create Route
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Pickups</TabsTrigger>
          <TabsTrigger value="completed">Completed Pickups</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Pickups</CardTitle>
              <CardDescription>Select pickups to create a route for collection</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone No.</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickups.map((pickup) => (
                    <TableRow key={pickup.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedPickups.includes(pickup.id)}
                          onChange={() => handleSelectPickup(pickup.id)}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{pickup.name}</div> 
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{pickup.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{pickup.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {format(pickup.date, "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {pickup.items.reduce((acc, item) => acc + item.quantity, 0)} items
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={pickup.status === "pending" ? "outline" : "default"}
                          className={
                            pickup.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                          }
                        >
                          {pickup.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(pickup)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Pickups</CardTitle>
              <CardDescription>View history of completed pickups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No completed pickups yet</h3>
                <p className="text-muted-foreground">Completed pickups will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pickup Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pickup Details</DialogTitle>
            <DialogDescription>Complete information about this pickup request</DialogDescription>
          </DialogHeader>
          {selectedPickup && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{selectedPickup.name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                  <div className="text-sm">
                    <p>{selectedPickup.email}</p>
                    <p>{selectedPickup.phone}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{selectedPickup.address}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Pickup Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{format(selectedPickup.date, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPickup.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Mark as Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pickup Route</DialogTitle>
            <DialogDescription>Your optimized route for selected pickups</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-muted/50">
              <p className="text-sm text-center">
                In a real application, this would display a Google Maps route with all selected pickup locations.
              </p>
              <div className="aspect-video bg-muted rounded-md mt-4 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Pickup Locations</h3>
              <div className="space-y-2">
                {pickups
                  .filter((pickup) => selectedPickups.includes(pickup.id))
                  .map((pickup, index) => (
                    <div key={pickup.id} className="flex items-center p-2 border rounded-md">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{pickup.name}</p>
                        <p className="text-sm text-muted-foreground">{pickup.address}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRouteDialog(false)}>
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Start Navigation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

