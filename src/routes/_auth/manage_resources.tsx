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
import { useState, useEffect } from 'react'
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
import { protectRoute } from "@/routes/_auth";
import { api } from "@/utils/api";

interface Resource {
  resource_id: number;
  type: string;
  quantity: number;
  name: string;
  available: boolean;
}

interface Report {
  report_id: number;
  category: string;
  status: string;
  report_date: string;
  resources: Resource[];
}

export const Route = createFileRoute('/_auth/manage_resources')({
  beforeLoad: ({ context }) => {
    protectRoute(context, ['charity']);
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Resource[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesData, reportsData] = await Promise.all([
          api<Resource[]>('/resource', 'GET'),
          api<Report[]>('/report', 'GET')
        ]);
        setResources(resourcesData.filter(r => r.available));
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAssignResource = async () => {
    if (!selectedResource || !selectedReport) return;

    try {
      if (quantity === selectedResource.quantity) {
        await api<Resource>(`/resource/${selectedResource.resource_id}`, 'PUT', {
          ...selectedResource,
          available: false
        });

        const reportToUpdate = reports.find(r => r.report_id.toString() === selectedReport);
        if (reportToUpdate) {
          await api<Report>(`/report/${reportToUpdate.report_id}`, 'PUT', {
            ...reportToUpdate,
            resources: [...reportToUpdate.resources, selectedResource]
          });
        }
      } else {
        await api<Resource>(`/resource/${selectedResource.resource_id}`, 'PUT', {
          ...selectedResource,
          quantity: selectedResource.quantity - quantity
        });

        const newResource = await api<Resource>('/resource', 'POST', {
          type: selectedResource.type,
          name: selectedResource.name,
          quantity: quantity,
          available: false
        });

        const reportToUpdate = reports.find(r => r.report_id.toString() === selectedReport);
        if (reportToUpdate) {
          await api<Report>(`/report/${reportToUpdate.report_id}`, 'PUT', {
            ...reportToUpdate,
            resources: [...reportToUpdate.resources, newResource]
          });
        }
      }

      const updatedResources = await api<Resource[]>('/resource', 'GET');
      setResources(updatedResources.filter(r => r.available));

      setIsDialogOpen(false);
      setSelectedResource(null);
      setSelectedReport("");
      setQuantity(0);
    } catch (error) {
      console.error('Error assigning resource:', error);
    }
  };

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
                <TableHead>{t("manage_resources.amount")}</TableHead>
                <TableHead>{t("manage_resources.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource: Resource) => (
                <TableRow key={resource.resource_id}>
                  <TableCell>{resource.resource_id}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>{resource.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedResource(resource);
                        setIsDialogOpen(true);
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
                        {reports.map((report) => (
                          <SelectItem key={report.report_id} value={report.report_id.toString()}>
                            {`Report ${report.report_id} - ${report.category} (${report.status})`}
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
