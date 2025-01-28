import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { useTranslation } from "react-i18next";
import { api } from "@/utils/api";
import { protectRoute } from "@/routes/_auth";
import { useAuth } from "@/auth";

// Walidacja formularza
const formSchema = z.object({
  category: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  city: z.string().min(1, "Miasto jest wymagane"),
  street: z.string().min(1, "Ulica jest wymagana"),
  buildingNumber: z.string().min(1, "Numer budynku jest wymagany"),
  zipCode: z.string().regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX"),
})

// Icona pinezki
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function MapMarker({ position, setPosition }: { 
  position: { lat: number; lng: number }
  setPosition: (pos: { lat: number; lng: number }) => void 
}) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position ? (
    <Marker position={position} icon={customIcon} />
  ) : null
}

export const Route = createFileRoute('/_auth/add_report')({
  beforeLoad: ({ context }) => {
    protectRoute(context, ['victim', 'charity']);
  },
  component: AddReport,
})

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  street: string;
  number: string;
  zipCode: string;
}

interface Report {
  victim: { userId: number };
  charity: { charity_id: number };
  category: string;
  location: Location;
  reportStatus: 'PENDING';
  report_date: string;
}

function AddReport() {
  const [position, setPosition] = useState({ lat: 51.7471696, lng: 19.4533291 })
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "Food",
      coordinates: position,
      city: "",
      street: "",
      buildingNumber: "",
      zipCode: "",
    },
  })

  useEffect(() => {
    form.setValue('coordinates', position)
  }, [position, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const currentDate = new Date().toISOString();
      if (!user) throw new Error('User not authenticated');
      
      const locationData: Location = {
        latitude: values.coordinates.lat,
        longitude: values.coordinates.lng,
        city: values.city,
        street: values.street,
        number: values.buildingNumber,
        zipCode: values.zipCode
      };

      const locationResponse = await api<Location>(
        "/api/locations/addLocation/",
        "POST",
        locationData
      );

      const reportData: Report = {
        victim: { userId: parseInt(user?.id) },
        charity: { charity_id: 1 },
        category: values.category,
        location: locationResponse,
        reportStatus: 'PENDING',
        report_date: currentDate
      };

      await api<Report>(
        "/report/",
        "POST",
        reportData
      );

      console.log("Report and location submitted successfully");
      
    } catch (error) {
      console.error("Failed to submit report or location:", error);
    }
  }

  const { t } = useTranslation();

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("add_report.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("add_report.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("add_report.category")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[1000]">
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Shelter">Shelter</SelectItem>
                      <SelectItem value="Cloths">Cloths</SelectItem>
                      <SelectItem value="Medication">Medication</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("add_report.category_desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates"
              render={() => (
                <FormItem>
                  <FormLabel>{t("add_report.map")}</FormLabel>
                  <FormControl>
                    <div className="h-[400px] w-full rounded-md border">
                      <MapContainer
                        center={position}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapMarker position={position} setPosition={setPosition} />
                      </MapContainer>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("add_report.map_desc")}
                    {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("add_report.city")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("add_report.enter_c")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("add_report.city_desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("add_report.street")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("add_report.enter_s")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("add_report.street_desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("add_report.building_number")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("add_report.enter_bn")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("add_report.building_number_desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("add_report.zip_code")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("add_report.enter_zc")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("add_report.zip_code_desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">{t("add_report.button")}</Button>
          </form>
        </Form>
      </div>
    </>
  )
}
