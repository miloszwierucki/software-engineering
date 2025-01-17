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

export const Route = createFileRoute('/_auth/manage_resources')({
  component: RouteComponent,
})

function RouteComponent() {

  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("manage_resources.title")}</h1>

      <div className="border rounded-lg mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("manage_resources.category")}</TableHead>
              <TableHead>{t("manage_resources.name")}</TableHead>
              <TableHead>{t("manage_resources.description")}</TableHead>
              <TableHead>{t("manage_resources.amount")}</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="default" className="bg-black hover:bg-gray-800">
          {t("manage_resources.button")}
        </Button>
      </div>
    </div>
  )
}
