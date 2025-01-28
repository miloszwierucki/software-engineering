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
import { protectRoute } from "@/routes/_auth";
import { useAuth } from "@/auth";

interface Report {
  report_id: number
  charity: {
    charity_id: number
    charity_name: string
  }
  category: string
  status: 'pending' | 'accepted' | 'completed'
  report_date: string
}

function IndexRoute() {
  const [reports, setReports] = useState<Report[]>([])
  const { user } = useAuth();
  const victimId = user?.id
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
      }
    }

    fetchVictimReports()
  }, [victimId])

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded'
      case 'accepted':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded'
      case 'completed':
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
                    <TableCell>{report.charity.charity_id}</TableCell>
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
  beforeLoad: ({ context }) => {
    protectRoute(context, ['victim']);
  },
  component: IndexRoute,
})
