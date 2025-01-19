import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next";

interface Report {
  id: number
  charityId: number
  firstName: string
  lastName: string
  category: string
  reportDate: Date
  status: 'Oczekujące' | 'Zaakceptowane' | 'Zakończone'
}

// Dane z backendu
const mockReports: Report[] = [
  {
    id: 1,
    charityId: 101,
    firstName: "Ktos1",
    lastName: "Tam1",
    category: "costam1",
    reportDate: new Date('2024-11-11'),
    status: 'Oczekujące'
  },
  {
    id: 2,
    charityId: 102,
    firstName: "Ktos2",
    lastName: "Tam2",
    category: "costam2",
    reportDate: new Date('2024-10-10'),
    status: 'Zaakceptowane'
  },
  {
    id: 3,
    charityId: 103,
    firstName: "Ktos3",
    lastName: "Tam3",
    category: "costam3",
    reportDate: new Date('2024-10-10'),
    status: 'Zakończone'
  },
]

export const Route = createFileRoute('/_auth/manage_report')({
  component: RouteComponent,
})

function RouteComponent() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStatusChange = (reportId: number, newStatus: Report['status']) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, status: newStatus }
          : report
      )
    )
    setIsDialogOpen(false)
  }

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Oczekujące':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded'
      case 'Zaakceptowane':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded'
      case 'Zakończone':
        return 'text-gray-600 bg-gray-100 px-2 py-1 rounded'
    }
  }

  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("manage_reports.title")}</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("manage_reports.organization")}</TableHead>
              <TableHead>{t("manage_reports.f_name")}</TableHead>
              <TableHead>{t("manage_reports.l_name")}</TableHead>
              <TableHead>{t("manage_reports.category")}</TableHead>
              <TableHead>{t("manage_reports.date")}</TableHead>
              <TableHead>{t("manage_reports.status")}</TableHead>
              <TableHead>{t("manage_reports.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.charityId}</TableCell>
                <TableCell>{report.firstName}</TableCell>
                <TableCell>{report.lastName}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>{report.reportDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={getStatusColor(report.status)}>
                    {report.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report)
                      setIsDialogOpen(true)
                    }}
                  >
                    {t("manage_reports.manage")}
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
            <DialogTitle>{t("manage_reports.popup.title")}</DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="py-4">
              <div className="space-y-2">
                <p><strong>ID:</strong> {selectedReport.id}</p>
                <p><strong>{t("manage_reports.popup.organization")}:</strong> {selectedReport.charityId}</p>
                <p><strong>{t("manage_reports.popup.person")}:</strong> {selectedReport.firstName} {selectedReport.lastName}</p>
                <p><strong>{t("manage_reports.popup.category")}:</strong> {selectedReport.category}</p>
                <p><strong>{t("manage_reports.popup.status")}:</strong> <span className={getStatusColor(selectedReport.status)}>{selectedReport.status}</span></p>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            {selectedReport?.status === 'Oczekujące' && (
              <Button
                onClick={() => handleStatusChange(selectedReport.id, 'Zaakceptowane')}
                className="bg-green-600 hover:bg-green-700"
              >
                {t("manage_reports.popup.accept")}
              </Button>
            )}
            {selectedReport?.status !== 'Zakończone' && selectedReport && (
              <Button
                onClick={() => handleStatusChange(selectedReport.id, 'Zakończone')}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("manage_reports.popup.finish")}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              {t("manage_reports.popup.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
