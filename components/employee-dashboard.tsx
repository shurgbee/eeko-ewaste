"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"

type Item = {
  id: number
  category: string
  quantity: number
  description: string | null
  submissionId: number
}

type Submission = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  pickupDate: string // Will convert to Date when using
  status: string
  createdAt: string
  items: Item[]
}

export function EmployeeDashboard() {
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPickup, setSelectedPickup] = useState<Submission | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedPickups, setSelectedPickups] = useState<number[]>([])
  const [showRouteDialog, setShowRouteDialog] = useState(false)
  const [routeLoading, setRouteLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions/get')
      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "Error",
        description: "Failed to load submissions data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPickup = (id: number) => {
    if (selectedPickups.includes(id)) {
      setSelectedPickups(selectedPickups.filter((pickupId) => pickupId !== id))
    } else {
      setSelectedPickups([...selectedPickups, id])
    }
  }

  useEffect(() => {
    // Progress bar simulation for long requests
    let interval: any;
    if (routeLoading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 5;
          // Cap at 90% until actual response comes back
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 1000); // Update every second
    } else {
      setLoadingProgress(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [routeLoading]);

  async function onList(addresses: string[]) {
    try {
      setRouteLoading(true);
      
      // Send addresses to API endpoint with longer timeout
      const response = await fetch('/api/mapslist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addresses),
      });

      setLoadingProgress(95);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate route');
      }
      
      const data = await response.json();
      setLoadingProgress(100);
      
      // Show success message
      toast({
        title: "Route generated",
        description: `Route has been copied to your clipboard`,
      });
      
      window.open(data.Link, "_blank")
      navigator.clipboard.writeText(data.Link)
    } catch (error) {
      console.error('Error generating route:', error);
      toast({
        title: "Route generation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setRouteLoading(false);
    }
  }

  const handleViewDetails = (pickup: Submission) => {
    setSelectedPickup(pickup)
    setShowDetails(true)
  }

  const handleCreateRoute = () => {
    setShowRouteDialog(true)
  }

  const handleMarkAsCompleted = async () => {
    if (!selectedPickup) return

    try {
      const response = await fetch('/api/submissions/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPickup.id,
          status: 'completed',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update submission status')
      }

      toast({
        title: "Success",
        description: "Pickup marked as completed",
      })
      
      // Refresh submissions and close dialog
      setShowDetails(false)
      fetchSubmissions()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update pickup status",
        variant: "destructive",
      })
    }
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const completedSubmissions = submissions.filter(s => s.status === 'completed')

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
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse delay-150"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              ) : pendingSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No pending pickups</h3>
                  <p className="text-muted-foreground">New pickup submissions will appear here</p>
                </div>
              ) : (
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
                    {pendingSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPickups.includes(submission.id)}
                            onChange={() => handleSelectPickup(submission.id)}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{submission.name}</div> 
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{submission.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{submission.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(submission.pickupDate), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {submission.items.reduce((acc, item) => acc + item.quantity, 0)} items
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={submission.status === "pending" ? "outline" : "default"}
                            className={
                              submission.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(submission)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Pickups</CardTitle>
              <CardDescription>View history of completed pickups</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse delay-150"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              ) : completedSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No completed pickups yet</h3>
                  <p className="text-muted-foreground">Completed pickups will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="font-medium">{submission.name}</div> 
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{submission.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(submission.pickupDate), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {submission.items.reduce((acc, item) => acc + item.quantity, 0)} items
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(submission)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
                    <span>{format(new Date(selectedPickup.pickupDate), "EEEE, MMMM d, yyyy")}</span>
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
                        <TableCell>{item.description || ''}</TableCell>
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
            {selectedPickup && selectedPickup.status === 'pending' && (
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={handleMarkAsCompleted}
              >
                Mark as Completed
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={(open) => {
        if (!open) {
          // Reset loading state when dialog closes
          setRouteLoading(false);
        }
        setShowRouteDialog(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pickup Route</DialogTitle>
            <DialogDescription>Your optimized route for selected pickups</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {routeLoading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Generating route...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Please be patient. This may take up to 20-30 seconds. Please be patient.
                </p>
              </div>
            )}
              
            <div className="border rounded-md p-4 bg-muted/50">
              <p className="text-sm text-center">
                Later on, we'll use the Google Maps API to create an Embed that displays the directions url, but there was no time :(
              </p>
              <div className="aspect-video bg-muted rounded-md mt-4 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Pickup Locations</h3>
              <div className="space-y-2">
                {submissions
                  .filter((submission) => selectedPickups.includes(submission.id))
                  .map((submission, index) => (
                    <div key={submission.id} className="flex items-center p-2 border rounded-md">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{submission.name}</p>
                        <p className="text-sm text-muted-foreground">{submission.address}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRouteDialog(false)} disabled={routeLoading}>
              Close
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              disabled={routeLoading}
              onClick={() => {
                const selectedAddresses = submissions
                  .filter(submission => selectedPickups.includes(submission.id))
                  .map(submission => submission.address);
                onList(selectedAddresses);
              }}
            >
              {routeLoading ? "Processing..." : "Start Navigation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

