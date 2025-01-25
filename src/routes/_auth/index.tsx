import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_auth/")({
  component: IndexRoute,
});

type ReportStatus = {
  open: number;
  closed: number;
};

interface Resource {
  resource_id: number;
  type: 'DONATION' | 'VOLUNTEER';
  quantity: number;
  available: boolean;
  volunteer?: {
    userId: number;
  };
  donation?: {
    donation_id: number;
  };
}

function IndexRoute() {
  const [resources, setResources] = useState<Resource[]>([]);

  const [reportStatus, setReportStatus] = useState<ReportStatus>({
    open: 0,
    closed: 0
  });

  const { t } = useTranslation();

  const centerPosition = { lat: 51.7471696, lng: 19.4533291 };

  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const areaCoordinates: [number, number][] = [
    [51.748123, 19.453696],
    [51.748206, 19.45493],
    [51.747478, 19.454989],
    [51.747398, 19.453819],
    [51.748123, 19.453696],
  ];

  const area2Coordinates: [number, number][] = [
    [51.754745, 19.443846],
    [51.755116, 19.448567],
    [51.754345, 19.448695],
    [51.753887, 19.444103],
    [51.754745, 19.443846],
  ];

  const area3Coordinates: [number, number][] = [
    [51.776968, 19.457322],
    [51.77621, 19.454832],
    [51.773427, 19.455487],
    [51.773069, 19.458309],
    [51.776968, 19.457322],
  ];

  const area4Coordinates: [number, number][] = [
    [51.757194, 19.488156],
    [51.755519, 19.480688],
    [51.75185, 19.48247],
    [51.752328, 19.486247],
    [51.754229, 19.489487],
    [51.757194, 19.488156],
  ];

  const marker1Position: [number, number] = [51.773995, 19.457697];
  const marker2Position: [number, number] = [51.775509, 19.455379];
  const marker3Position: [number, number] = [51.755961, 19.487287];
  const marker4Position: [number, number] = [51.754452, 19.483596];

  const [reportType, setReportType] = useState<string>("");
  const [reportFormat, setReportFormat] = useState<string>("");

  const reportTypes = [
    "volunteers",
    "victims",
    "resources",
    "donations",
    "donators",
    "charities",
    "authorities",
    "reports",
    "evaluations",
  ];

  const reportFormats = ["csv", "pdf", "json"];

  const handleGenerateReport = async () => {
    if (!reportType || !reportFormat) {
      alert(t("reports.select_both"));
      return;
    }

    try {
      await api(`/reporting/generateAndExportReport/${reportType}/${reportFormat}`, "POST");
      alert(t("reports.generated"));
    } catch (error) {
      alert(t("reports.error"));
    }
  };

  useEffect(() => {
    const fetchAvailableReports = async () => {
      try {
        const available = await api<unknown[]>("/volunteer/available", "GET");
        setReportStatus(prev => ({ ...prev, open: available.length }));
      } catch (err) {
        console.error("Failed to fetch available reports:", err);
      }
    };

    const fetchCompletedReports = async () => {
      try {
        const completed = await api<unknown[]>("/volunteer/completed", "GET");
        setReportStatus(prev => ({ ...prev, closed: completed.length }));
      } catch (err) {
        console.error("Failed to fetch completed reports:", err);
      }
    };

    const fetchResources = async () => {
      try {
        const allResources = await api<Resource[]>("/volunteer/", "GET");
        setResources(allResources);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchAvailableReports();
    fetchCompletedReports();
    fetchResources();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("index.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("index.subtitle")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 mx-3">
              <Download className="h-4 w-4" />
              {t("reports.generate")}
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[1101]">
            <DialogHeader>
              <DialogTitle>{t("reports.select_options")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>{t("reports.type")}</label>
                <Select
                  value={reportType}
                  onValueChange={(value) => setReportType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("reports.select_type")} />
                  </SelectTrigger>
                  <SelectContent className="z-[1102]">
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`reports.types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>{t("reports.format")}</label>
                <Select
                  value={reportFormat}
                  onValueChange={(value) => setReportFormat(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("reports.select_format")} />
                  </SelectTrigger>
                  <SelectContent className="z-[1102]">
                    {reportFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateReport}>
                {t("reports.generate")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-6 p-6">

        <Card>
          <CardHeader>
            <CardTitle>{t("index.map")}</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            
            <div className="h-[400px] w-full rounded-md border">
              <MapContainer
                center={centerPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                {isDialogOpen && (
                  <div className="absolute inset-0 bg-black/80 z-[1000]" />
                )}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polygon
                  positions={areaCoordinates}
                  pathOptions={{
                    color: "blue",
                    fillColor: "blue",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Polygon
                  positions={area2Coordinates}
                  pathOptions={{
                    color: "blue",
                    fillColor: "blue",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Polygon
                  positions={area3Coordinates}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Polygon
                  positions={area4Coordinates}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Marker position={marker1Position} icon={customIcon} />
                <Marker position={marker2Position} icon={customIcon} />
                <Marker position={marker3Position} icon={customIcon} />
                <Marker position={marker4Position} icon={customIcon} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("index.open_reps")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStatus.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("index.closed_reps")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStatus.closed}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("index.resources")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("index.res_category")}</TableHead>
                  <TableHead className="text-right">
                    {t("index.res_amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources
                  .filter(resource => resource.available)
                  .map((resource) => (
                    <TableRow key={resource.resource_id}>
                      <TableCell className="font-medium">
                        {resource.type}
                      </TableCell>
                      <TableCell className="text-right">
                        {resource.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
