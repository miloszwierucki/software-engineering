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
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("add_resources.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("add_resources.subtitle")}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("add_resources.unconfirmed")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("add_resources.category")}</TableHead>
                  <TableHead>{t("add_resources.name")}</TableHead>
                  <TableHead className="text-right">{t("add_resources.amount")}</TableHead>
                  <TableHead className="text-center">{t("add_resources.status")}</TableHead>
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
                          <Label htmlFor={`accept-${resource.id}`}>{t("add_resources.accept")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rejected" id={`reject-${resource.id}`} />
                          <Label htmlFor={`reject-${resource.id}`}>{t("add_resources.reject")}</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button 
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground"
          >
            {t("add_resources.button")}
          </Button>
        </div>
      </div>
    </>
  )
}
