import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api } from '@/utils/api'

interface Report {
  report_id: number
  charity: number
  category: string
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED'
  report_date: string
}

const mockReports: Report[] = [
    {
        report_id: 1,
        charity: 101,
        category: "costam1",
        report_date: "2024-11-11",
        status: 'PENDING'
    },
    {
        report_id: 2,
        charity: 102,
        category: "costam2",
        report_date: "2024-01-21",
        status: 'ACCEPTED'
    },
  ]

function IndexRoute() {
  const [reports, setReports] = useState<Report[]>([])
  const victimId = 1
  const { t } = useTranslation()

  useEffect(() => {
    const fetchVictimReports = async () => {
      try {
        const response = await api<Report[]>(
          `/report/victim/${victimId}`,
          'GET',
        )
        setReports(response)
      } catch (err) {
        console.error('Failed to fetch victim reports:', err)
        setReports(mockReports)
      }
    }

    fetchVictimReports()
  }, [victimId])

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded'
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded'
      case 'COMPLETED':
        return 'text-gray-600 bg-gray-100 px-2 py-1 rounded'
    }
  }

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">{t('index.title')}</h1>
          <p className="ml-1 font-light text-gray-600">{t('index.subtitle')}</p>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('index.my_reports')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t('index.charity')}</TableHead>
                  <TableHead>{t('index.res_category')}</TableHead>
                  <TableHead>{t('index.date')}</TableHead>
                  <TableHead>{t('index.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.report_id}>
                    <TableCell>{report.report_id}</TableCell>
                    <TableCell>{report.charity}</TableCell>
                    <TableCell>{report.category}</TableCell>
                    <TableCell>
                      {new Date(report.report_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusColor(report.status)}>
                        {t(`index.statuses.${report.status.toLowerCase()}`)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_auth/victim_index')({
  component: IndexRoute,
})
