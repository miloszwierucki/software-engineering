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
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next";
import { api } from "@/utils/api";
import { protectRoute } from "@/routes/_auth";

interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

interface Volunteer extends User {
  available: boolean
  currentReport?: Report
  evaluations: VolunteerEvaluation[]
}

interface VolunteerEvaluation {
  evaluationId: number
  volunteer: Volunteer
  report: Report
  rating: number
  description: string
  evaluationDate: Date
}

interface Report {
  report_id: number
  victim: {
    id: number
  }
  category: string
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED'
  report_date: Date
  accept_date?: Date
  completion_date?: Date
  volunteers: Volunteer[]
}

const mockReports: Report[] = [
  {
    report_id: 1,
    victim: { id: 1 },
    category: "Food",
    report_date: new Date('2024-11-11'),
    status: 'PENDING',
    volunteers: []
  },
  {
    report_id: 2,
    victim: { id: 1 },
    category: "Food",
    report_date: new Date('2024-11-11'),
    status: 'ACCEPTED',
    volunteers: []
  }
]

const mockVolunteers: Volunteer[] = [
  {
    userId: 1,
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
    phoneNumber: "123456789",
    available: true,
    evaluations: [],
  },
  {
    userId: 2,
    firstName: "Anna",
    lastName: "Nowak",
    email: "anna.nowak@example.com",
    phoneNumber: "987654321",
    available: true,
    evaluations: [],
  },
  {
    userId: 3,
    firstName: "Piotr",
    lastName: "Wiśniewski",
    email: "piotr.wisniewski@example.com",
    phoneNumber: "456789123",
    available: false,
    currentReport: mockReports[0],
    evaluations: [],
  }
];

export const Route = createFileRoute('/_auth/manage_report')({
  beforeLoad: ({ context }) => {
    protectRoute(context, ['charity']);
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEvaluateDialogOpen, setIsEvaluateDialogOpen] = useState(false)
  const [evaluation, setEvaluation] = useState({ rating: 0, description: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsResponse, volunteersResponse] = await Promise.all([
          api<Report[]>("/report/", "GET"),
          api<Volunteer[]>("/resource/volunteers", "GET")
        ]);

        const transformedReports = reportsResponse.map(report => ({
          report_id: report.report_id,
          victim: report.victim,
          category: report.category,
          status: report.status,
          report_date: new Date(report.report_date),
          accept_date: report.accept_date ? new Date(report.accept_date) : undefined,
          completion_date: report.completion_date ? new Date(report.completion_date) : undefined,
          volunteers: report.volunteers
        }));

        const transformedVolunteers = volunteersResponse.map(vol => ({
          userId: vol.userId,
          firstName: vol.firstName,
          lastName: vol.lastName,
          email: vol.email,
          phoneNumber: vol.phoneNumber,
          available: vol.available,
          currentReport: vol.currentReport,
          evaluations: vol.evaluations || []
        }));

        setReports(transformedReports);
        setVolunteers(transformedVolunteers);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setReports(mockReports);
        setVolunteers(mockVolunteers);
        mockReports[1].volunteers = [mockVolunteers[2]]
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (reportId: number, newStatus: Report['status']) => {
    try {
      await api(`/report/${reportId}`, "PUT");
      setIsDialogOpen(false);
      setReports(prevReports =>
        prevReports.map(report =>
          report.report_id === reportId
            ? { ...report, status: newStatus }
            : report
        )
      )
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

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

  const handleAssignVolunteer = async (reportId: number, volunteerId: number) => {
    try {
      await api(`/volunteer/assign/${reportId}/${volunteerId}`, "PUT");
      setIsAssignDialogOpen(false);
    } catch (err) {
      console.error("Failed to assign volunteer:", err);
    }
  };

  const handleEvaluateVolunteer = async (volunteerId: number, reportId: number) => {
    try {
      await api(`/volunteer/evaluate/${volunteerId}/${reportId}`, "POST", evaluation);
      setIsEvaluateDialogOpen(false);
      setEvaluation({ rating: 0, description: '' });
    } catch (err) {
      console.error("Failed to evaluate volunteer:", err);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("manage_reports.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("manage_reports.subtitle")}
          </p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t("manage_reports.victim")}</TableHead>
                <TableHead>{t("manage_reports.category")}</TableHead>
                <TableHead>{t("manage_reports.date")}</TableHead>
                <TableHead>{t("manage_reports.status")}</TableHead>
                <TableHead>{t("manage_reports.volunteers")}</TableHead>
                <TableHead>{t("manage_reports.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.report_id}>
                  <TableCell>{report.report_id}</TableCell>
                  <TableCell>{report.victim.id}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{report.report_date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(report.status)}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {report.status == "ACCEPTED" && (
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report)
                            setIsAssignDialogOpen(true)
                          }}
                        >
                          {t("manage_reports.assign_volunteer")}
                        </Button>
                        {report.volunteers.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report)
                              setIsEvaluateDialogOpen(true)
                            }}
                          >
                            {t("manage_reports.evaluate_volunteers")}
                          </Button>
                        )}
                      </div>
                    )}
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
                  <p><strong>ID:</strong> {selectedReport.report_id}</p>
                  <p><strong>{t("manage_reports.victim")}:</strong> {selectedReport.victim.id}</p>
                  <p><strong>{t("manage_reports.popup.category")}:</strong> {selectedReport.category}</p>
                  <p><strong>{t("manage_reports.popup.status")}:</strong> <span className={getStatusColor(selectedReport.status)}>{selectedReport.status}</span></p>
                </div>
              </div>
            )}

            <DialogFooter className="space-x-2">
              {selectedReport?.status === 'PENDING' && (
                <Button
                  onClick={() => handleStatusChange(selectedReport.report_id, 'ACCEPTED')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t("manage_reports.popup.accept")}
                </Button>
              )}
              {selectedReport?.status !== 'COMPLETED' && selectedReport && (
                <Button
                  onClick={() => handleStatusChange(selectedReport.report_id, 'COMPLETED')}
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

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("manage_reports.assign_volunteer_title")}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                {volunteers
                  .filter(v => v.available)
                  .map(volunteer => (
                    <div key={volunteer.userId} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{volunteer.firstName} {volunteer.lastName}</p>
                        <p className="text-sm text-gray-500">{volunteer.email}</p>
                      </div>
                      <Button
                        onClick={() => selectedReport && handleAssignVolunteer(selectedReport.report_id, volunteer.userId)}
                      >
                        {t("manage_reports.assign")}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEvaluateDialogOpen} onOpenChange={setIsEvaluateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("manage_reports.evaluate_volunteer_title")}</DialogTitle>
            </DialogHeader>
            
            {selectedReport && (
              <div className="py-4">
                <div className="space-y-4">
                  {selectedReport.volunteers.map(volunteer => (
                    <div key={volunteer.userId} className="space-y-2">
                      <p className="font-medium">{volunteer.firstName} {volunteer.lastName}</p>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={evaluation.rating}
                        onChange={e => setEvaluation(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="border p-2 rounded"
                      />
                      <textarea
                        value={evaluation.description}
                        onChange={e => setEvaluation(prev => ({ ...prev, description: e.target.value }))}
                        className="border p-2 rounded w-full"
                        placeholder={t("manage_reports.evaluation_description")}
                      />
                      <Button
                        onClick={() => handleEvaluateVolunteer(volunteer.userId, selectedReport.report_id)}
                      >
                        {t("manage_reports.submit_evaluation")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
