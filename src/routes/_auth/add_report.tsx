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
  component: AddReport,
})

function AddReport() {
  const [position, setPosition] = useState({ lat: 51.7471696, lng: 19.4533291 })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "costam1",
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Łączenie z backendem
    console.log(values)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Formularz zgłoszenia</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[1000]">
                    <SelectItem value="costam1">costam1</SelectItem>
                    <SelectItem value="costam2">costam2</SelectItem>
                    <SelectItem value="costam3">costam3</SelectItem>
                    <SelectItem value="costam4">costam4</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Wybierz kategorię zgłoszenia.
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
                <FormLabel>Wybierz lokalizację na mapie</FormLabel>
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
                  Kliknij na mapę, aby ustawić pinezke. Aktualne współrzędne:&nbsp;
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
                <FormLabel>Miasto</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz nazwę miasta" {...field} />
                </FormControl>
                <FormDescription>
                  Podaj nazwę miasta, w którym potrzebna jest pomoc.
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
                <FormLabel>Ulica</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz nazwę ulicy" {...field} />
                </FormControl>
                <FormDescription>
                  Podaj nazwę ulicy, na której potrzebna jest pomoc.
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
                <FormLabel>Numer budynku</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz numer budynku" {...field} />
                </FormControl>
                <FormDescription>
                  Podaj numer budynku, w którym potrzebna jest pomoc.
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
                <FormLabel>Kod pocztowy</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz kod pocztowy" {...field} />
                </FormControl>
                <FormDescription>
                  Podaj kod pocztowy obszaru, format XX-XXX.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Wyślij zgłoszenie</Button>
        </form>
      </Form>
    </div>
  )
}
