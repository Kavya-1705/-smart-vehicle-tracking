import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { 
  MapPin, 
  Navigation, 
  Car, 
  User, 
  Gauge, 
  Shield,
  Clock,
  X,
  LocateFixed,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Vehicle } from '@/types';
import { dummyVehicles } from '@/data/dummyData';
import L from 'leaflet';

// Custom marker icons
const createVehicleIcon = (status: string, isSelected: boolean) => {
  const color = status === 'Active' ? '#10B981' : status === 'Idle' ? '#F59E0B' : status === 'Accident' ? '#EF4444' : '#6B7280';
  const size = isSelected ? 44 : 36;
  return L.divIcon({
    className: 'vehicle-marker',
    html: `
      <div class="relative" style="width: ${size}px; height: ${size}px;">
        <div 
          class="w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'ring-4 ring-primary/50' : ''}" 
          style="background-color: ${color}30; border: 3px solid ${color};"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? 20 : 16}" height="${isSelected ? 20 : 16}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
        ${status === 'Active' ? `<div class="absolute inset-0 rounded-full animate-ping" style="background-color: ${color}20;"></div>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

function getStatusBadge(status: string) {
  const styles = {
    Active: 'status-active',
    Idle: 'status-idle',
    Accident: 'status-accident',
    Offline: 'status-offline'
  };
  return styles[status as keyof typeof styles] || styles.Offline;
}

function formatTime(timeString: string) {
  const date = new Date(timeString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

// Map controller component to handle map interactions
function MapController({ 
  selectedVehicle
}: { 
  selectedVehicle: Vehicle | null;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo(
        [selectedVehicle.location.lat, selectedVehicle.location.lng], 
        14, 
        { duration: 1 }
      );
    }
  }, [selectedVehicle, map]);

  return null;
}

export function LiveTracking() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [geofenceCenter] = useState<[number, number]>([19.0760, 72.8777]);
  const [geofenceRadius, setGeofenceRadius] = useState(50000); // 50km in meters

  useEffect(() => {
    setVehicles(dummyVehicles);
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeVehicles = vehicles.filter(v => v.status === 'Active').length;

  return (
    <div className="h-[calc(100vh-4rem)] -m-4 lg:-m-8 animate-fade-in">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`${selectedVehicle ? 'w-80' : 'w-72'} flex flex-col bg-card border-r border-border transition-all duration-300`}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Live Tracking
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeVehicles} of {vehicles.length} vehicles active
            </p>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {filteredVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  selectedVehicle?.id === vehicle.id 
                    ? 'bg-primary/20 border border-primary/50' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBadge(vehicle.status)}`}>
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{vehicle.id}</span>
                      <Badge variant="outline" className={`text-xs ${getStatusBadge(vehicle.status)}`}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{vehicle.driver}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {vehicle.speed} km/h
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(vehicle.lastUpdated)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Geofence Controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <LocateFixed className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Geofence Zone</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Radius</span>
                <span>{(geofenceRadius / 1000).toFixed(0)} km</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer 
            center={mapCenter} 
            zoom={5} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Geofence Circle */}
            <Circle
              center={geofenceCenter}
              radius={geofenceRadius}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 10'
              }}
            />
            
            {/* Vehicle Markers */}
            {vehicles.map((vehicle) => (
              <Marker
                key={vehicle.id}
                position={[vehicle.location.lat, vehicle.location.lng]}
                icon={createVehicleIcon(vehicle.status, selectedVehicle?.id === vehicle.id)}
                eventHandlers={{
                  click: () => setSelectedVehicle(vehicle),
                }}
              >
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{vehicle.id}</span>
                      <Badge variant="outline" className={getStatusBadge(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                    <p className="text-sm">{vehicle.location.address}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        {vehicle.speed} km/h
                      </span>
                      <span>Safety: {vehicle.safetyScore}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapController selectedVehicle={selectedVehicle} />
          </MapContainer>

          {/* Vehicle Details Panel */}
          {selectedVehicle && (
            <div className="absolute top-4 right-4 w-80 animate-slide-in">
              <Card className="shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusBadge(selectedVehicle.status)}`}>
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selectedVehicle.id}</CardTitle>
                        <Badge variant="outline" className={`mt-1 ${getStatusBadge(selectedVehicle.status)}`}>
                          {selectedVehicle.status}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedVehicle(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Driver Info */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedVehicle.driver}</p>
                      <p className="text-sm text-muted-foreground">Driver</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.location.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {/* Speed & Safety */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Gauge className="w-4 h-4" />
                        <span className="text-sm">Speed</span>
                      </div>
                      <p className="text-xl font-bold">{selectedVehicle.speed}</p>
                      <p className="text-xs text-muted-foreground">km/h</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Safety</span>
                      </div>
                      <p className="text-xl font-bold">{selectedVehicle.safetyScore}%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {formatTime(selectedVehicle.lastUpdated)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    {selectedVehicle.status === 'Accident' && (
                      <Button className="flex-1" variant="destructive">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
