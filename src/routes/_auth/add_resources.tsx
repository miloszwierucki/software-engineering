import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from 'react'

export const Route = createFileRoute('/_auth/add_resources')({
  component: RouteComponent,
})

interface ResourceSubmission {
  id: number
  category: string
  name: string
  quantity: number
  status: 'pending' | 'accepted' | 'rejected'
}

function RouteComponent() {
  const [resources, setResources] = useState<ResourceSubmission[]>([
    {
      id: 1,
      category: 'Pieniądze',
      name: 'Pieniądze',
      quantity: 500,
      status: 'pending',
    },
    {
      id: 2,
      category: 'Ubrania',
      name: 'Skarpety',
      quantity: 10,
      status: 'pending',
    },
    {
      id: 3,
      category: 'Jedzenie',
      name: 'Woda',
      quantity: 100,
      status: 'pending',
    },
    {
      id: 4,
      category: 'Wolontariusze',
      name: 'Wolontariusze',
      quantity: 1,
      status: 'pending',
    },
  ])

  const handleStatusChange = (id: number, value: string) => {
    setResources(resources.map(resource => 
      resource.id === id 
        ? { ...resource, status: value as 'pending' | 'accepted' | 'rejected' }
        : resource
    ))
  }

  const handleConfirm = () => {
    // Wysłanie zatwierdzonych zasobów do backendu
    const acceptedResources = resources.filter(r => r.status === 'accepted')
    const rejectedResources = resources.filter(r => r.status === 'rejected')
    console.log('Accepted resources:', acceptedResources)
    console.log('Rejected resources:', rejectedResources)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Zatwierdzanie Zasobów</h1>

      <Card>
        <CardHeader>
          <CardTitle>Niepotwierdzone Zasoby</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategoria</TableHead>
                <TableHead>Nazwa</TableHead>
                <TableHead className="text-right">Ilość</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.category}</TableCell>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell className="text-right">{resource.quantity}</TableCell>
                  <TableCell>
                    <RadioGroup
                      defaultValue="pending"
                      value={resource.status}
                      onValueChange={(value) => handleStatusChange(resource.id, value)}
                      className="flex space-x-4 justify-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="accepted" id={`accept-${resource.id}`} />
                        <Label htmlFor={`accept-${resource.id}`}>Akceptuj</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rejected" id={`reject-${resource.id}`} />
                        <Label htmlFor={`reject-${resource.id}`}>Odrzuć</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground"
            >
              Potwierdź wybór
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
