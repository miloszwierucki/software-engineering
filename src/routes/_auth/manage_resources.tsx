import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useTranslation } from "react-i18next";
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Dane z backendu
const resources = [
  {
    id: 1,
    type: 'Pieniądze',
    name: 'Pieniądze',
    description: 'Pieniądze',
    quantity: 500,
  },
  {
    id: 2,
    type: 'Jedzenie',
    name: 'Woda',
    description: '500ml',
    quantity: 20,
  },
  {
    id: 3,
    type: 'Ubrania',
    name: 'Skarpety',
    description: 'Rozmiar 40',
    quantity: 10,
  },
]

// Mock reports
const mockReports = [
  { id: 1, name: "Report #1" },
  { id: 2, name: "Report #2" },
  { id: 3, name: "Report #3" },
]

export const Route = createFileRoute('/_auth/manage_resources')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(0)

  const handleAssignResource = () => {
    // logic to assign the resource to the report
    console.log('Assigning resource:', selectedResource)
    console.log('To report:', selectedReport)
    console.log('Quantity:', quantity)
    setIsDialogOpen(false)
    setSelectedResource(null)
    setSelectedReport("")
    setQuantity(0)
  }

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("manage_resources.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("manage_resources.subtitle")}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="border rounded-lg mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t("manage_resources.category")}</TableHead>
                <TableHead>{t("manage_resources.name")}</TableHead>
                <TableHead>{t("manage_resources.description")}</TableHead>
                <TableHead>{t("manage_resources.amount")}</TableHead>
                <TableHead>{t("manage_resources.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.id}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell>{resource.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedResource(resource)
                        setIsDialogOpen(true)
                      }}
                    >
                      {t("manage_resources.assign")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("manage_resources.popup.title")}</DialogTitle>
            </DialogHeader>
            
            {selectedResource && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p><strong>{t("manage_resources.name")}:</strong> {selectedResource.name}</p>
                  <p><strong>{t("manage_resources.category")}:</strong> {selectedResource.type}</p>
                  <p><strong>{t("manage_resources.amount")}:</strong> {selectedResource.quantity}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label>{t("manage_resources.popup.select_report")}</label>
                    <Select
                      value={selectedReport}
                      onValueChange={setSelectedReport}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("manage_resources.popup.select_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {mockReports.map((report) => (
                          <SelectItem key={report.id} value={report.id.toString()}>
                            {report.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label>{t("manage_resources.popup.quantity")}</label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      max={selectedResource.quantity}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="space-x-2">
              <Button
                onClick={handleAssignResource}
                disabled={Boolean(!selectedReport || quantity <= 0 || (selectedResource && quantity > selectedResource.quantity))}
              >
                {t("manage_resources.popup.assign")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t("manage_resources.popup.cancel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
