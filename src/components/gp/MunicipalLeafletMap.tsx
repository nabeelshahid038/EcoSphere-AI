import { useEffect, useState, type ComponentType } from "react";
import type { DivIcon } from "leaflet";
import type { MapContainerProps, MarkerProps, TileLayerProps } from "react-leaflet";
import type { MunicipalIncident } from "@/lib/municipal-data";
import { ListSkeleton } from "./FeedbackStates";

type LeafletParts = {
  MapContainer: ComponentType<MapContainerProps>;
  TileLayer: ComponentType<TileLayerProps>;
  Marker: ComponentType<MarkerProps>;
  iconFor: (incident: MunicipalIncident) => DivIcon;
};

const markerTone: Record<MunicipalIncident["layer"], string> = {
  Dumping: "#ef4444",
  Litter: "#f59e0b",
  Burning: "#f97316",
  "Blocked Drain": "#3b82f6",
  Cleanup: "#22c55e",
  Resolved: "#94a3b8",
};

export function MunicipalLeafletMap({
  incidents,
  onSelect,
}: {
  incidents: MunicipalIncident[];
  onSelect: (incident: MunicipalIncident) => void;
}) {
  const [parts, setParts] = useState<LeafletParts | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([reactLeaflet, leaflet]) => {
      if (!active) return;
      setParts({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        iconFor: (incident) =>
          leaflet.divIcon({
            className: "municipal-map-marker",
            html: `<span style="--marker-color: ${markerTone[incident.layer]}"><i class="${incident.severity === "Critical" ? "is-critical" : ""}"></i></span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
      });
    });
    return () => {
      active = false;
    };
  }, []);

  if (!parts) {
    return (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,var(--color-primary)/15,transparent_32%),linear-gradient(135deg,var(--color-muted),var(--color-card))] p-6">
        <div className="w-full max-w-sm">
          <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
            Loading live map…
          </p>
          <ListSkeleton rows={3} />
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, iconFor } = parts;
  return (
    <MapContainer
      center={[24.86, 67.04]}
      zoom={12}
      zoomControl={false}
      className="h-full w-full"
      aria-label="Live municipal operations map of Karachi"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={iconFor(incident)}
          eventHandlers={{ click: () => onSelect(incident) }}
        />
      ))}
    </MapContainer>
  );
}
