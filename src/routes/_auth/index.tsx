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

export const Route = createFileRoute("/_auth/")({
  component: IndexRoute,
});

type Resource = {
  category: string;
  name: string;
  quantity: number;
};

type ReportStatus = {
  open: number;
  closed: number;
};

function IndexRoute() {
  const resources: Resource[] = [
    { category: "Pieniądze", name: "Pieniądze", quantity: 24000 },
    { category: "Jedzenie", name: "Woda", quantity: 500 },
    { category: "Jedzenie", name: "Chleb", quantity: 50 },
    { category: "Ubrania", name: "Skarpety", quantity: 100 },
    { category: "Wolontariusze", name: "Wolontariusze", quantity: 40 },
  ];

  const reportStatus: ReportStatus = {
    open: 15,
    closed: 45,
  };

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
      </div>
      <div className="space-y-6 p-6">

        <Card>
          <CardHeader>
            <CardTitle>{t("index.map")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-md border">
              <MapContainer
                center={centerPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
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
                  <TableHead>{t("index.res_name")}</TableHead>
                  <TableHead className="text-right">
                    {t("index.res_amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {resource.category}
                    </TableCell>
                    <TableCell>{resource.name}</TableCell>
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
