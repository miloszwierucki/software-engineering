import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
})

type Resource = {
  category: string
  name: string
  quantity: number
}

type ReportStatus = {
  open: number
  closed: number
}

function RouteComponent() {
  const resources: Resource[] = [
    { category: 'Pieniądze', name: 'Pieniądze', quantity: 24000},
    { category: 'Jedzenie', name: 'Woda', quantity: 500},
    { category: 'Jedzenie', name: 'Chleb', quantity: 50},
    { category: 'Ubrania', name: 'Skarpety', quantity: 100},
    { category: 'Wolontariusze', name: 'Wolontariusze', quantity: 40},
  ]

  const reportStatus: ReportStatus = {
    open: 15,
    closed: 45,
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Raport Działań</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Otwarte Raporty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStatus.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zamknięte Raporty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStatus.closed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dostępne Zasoby</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategoria</TableHead>
                <TableHead>Nazwa</TableHead>
                <TableHead className="text-right">Ilość</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{resource.category}</TableCell>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell className="text-right">{resource.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}