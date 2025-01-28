import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import { protectRoute } from '@/routes/_auth'

interface Location {
  location_id: number
  latitude: number
  longitude: number
  city: string
  street: string
  number: string
  zipCode: string
}

function IndexRoute() {
  const [locations, setLocations] = useState<Location[]>([])
  const { t } = useTranslation()

  const centerPosition = { lat: 51.7471696, lng: 19.4533291 }

  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const areaCoordinates: [number, number][] = [
    [51.748123, 19.453696],
    [51.748206, 19.45493],
    [51.747478, 19.454989],
    [51.747398, 19.453819],
    [51.748123, 19.453696],
  ]

  const area2Coordinates: [number, number][] = [
    [51.754745, 19.443846],
    [51.755116, 19.448567],
    [51.754345, 19.448695],
    [51.753887, 19.444103],
    [51.754745, 19.443846],
  ]

  const area3Coordinates: [number, number][] = [
    [51.776968, 19.457322],
    [51.77621, 19.454832],
    [51.773427, 19.455487],
    [51.773069, 19.458309],
    [51.776968, 19.457322],
  ]

  const area4Coordinates: [number, number][] = [
    [51.757194, 19.488156],
    [51.755519, 19.480688],
    [51.75185, 19.48247],
    [51.752328, 19.486247],
    [51.754229, 19.489487],
    [51.757194, 19.488156],
  ]

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api<Location[]>('/api/locations/getAllLocations', 'GET')
        setLocations(response)
      } catch (err) {
        console.error('Failed to fetch locations:', err)
      }
    }

    fetchLocations()
  }, [])

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">{t('index.title')}</h1>
          <p className="ml-1 font-light text-gray-600">{t('index.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('index.map')}</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-[400px] w-full rounded-md border">
              <MapContainer
                center={centerPosition}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polygon
                  positions={areaCoordinates}
                  pathOptions={{
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Polygon
                  positions={area2Coordinates}
                  pathOptions={{
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Polygon
                  positions={area3Coordinates}
                  pathOptions={{
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                <Polygon
                  positions={area4Coordinates}
                  pathOptions={{
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                {locations.map((location) => (
                  <Marker
                    key={location.location_id}
                    position={[location.latitude, location.longitude]}
                    icon={customIcon}
                  />
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_auth/donator_index')({
  beforeLoad: ({ context }) => {
    protectRoute(context, ['donator'])
  },
  component: IndexRoute,
})
