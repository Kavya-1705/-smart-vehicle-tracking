import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Car, 
  AlertTriangle, 
  Activity, 
  Shield, 
  Clock,
  MapPin,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Vehicle, Alert } from '@/types';
import { dummyVehicles, dummyAlerts } from '@/data/dummyData';
import L from 'leaflet';

// Custom marker icons
const createVehicleIcon = (status: string) => {
  const color = status === 'Active' ? '#10B981' : status === 'Idle' ? '#F59E0B' : status === 'Accident' ? '#EF4444' : '#6B7280';
  return L.divIcon({
    className: 'vehicle-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${color}20; border: 2px solid ${color};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
        ${status === 'Active' ? '<div class="absolute inset-0 rounded-full animate-ping bg-emerald-500/30"></div>' : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className={`text-sm mt-1 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusBadge(status: string) {
  const styles = {
    Active: 'status-active',
    Idle: 'status-idle',
    Accident: 'status-accident',
    Offline: 'status-offline'
  };
  return styles[status as keyof typeof styles] || styles.Offline;
}

function getSeverityBadge(severity: string) {
  const styles = {
    High: 'severity-high',
    Medium: 'severity-medium',
    Low: 'severity-low'
  };
  return styles[severity as keyof typeof styles] || styles.Low;
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

export function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mapCenter] = useState<[number, number]>([20.5937, 78.9629]);

  useEffect(() => {
    setVehicles(dummyVehicles);
    setAlerts(dummyAlerts.slice(0, 5));
  }, []);

  const stats = {
    totalVehicles: vehicles.length,
    activeAlerts: alerts.filter(a => a.status === 'Pending').length,
    accidentsToday: alerts.filter(a => a.type === 'Accident' && new Date(a.time).toDateString() === new Date().toDateString()).length,
    avgSafetyScore: Math.round(vehicles.reduce((acc, v) => acc + v.safetyScore, 0) / (vehicles.length || 1))
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Real-time fleet monitoring overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Vehicles" 
          value={stats.totalVehicles} 
          icon={Car}
          trend="2 new this week"
          trendUp={true}
        />
        <StatCard 
          title="Active Alerts" 
          value={stats.activeAlerts} 
          icon={AlertTriangle}
          trend="3 pending"
          trendUp={false}
        />
        <StatCard 
          title="Accidents Today" 
          value={stats.accidentsToday} 
          icon={Activity}
          trend="1 critical"
          trendUp={false}
        />
        <StatCard 
          title="Avg Safety Score" 
          value={`${stats.avgSafetyScore}%`} 
          icon={Shield}
          trend="+2.5%"
          trendUp={true}
        />
      </div>

      {/* Map and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Live Vehicle Locations
              </CardTitle>
              <Badge variant="outline" className="status-active">
                <Navigation className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] rounded-b-lg overflow-hidden">
              <MapContainer 
                center={mapCenter} 
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {vehicles.map((vehicle) => (
                  <Marker
                    key={vehicle.id}
                    position={[vehicle.location.lat, vehicle.location.lng]}
                    icon={createVehicleIcon(vehicle.status)}
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
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div 
                  key={alert.id} 
                  className="p-3 rounded-lg bg-muted/50 card-hover animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{alert.vehicleId}</span>
                        <Badge variant="outline" className={`text-xs ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(alert.time)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Vehicle Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Vehicle Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="p-4 rounded-lg bg-muted/50 card-hover text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <p className="font-medium text-sm">{vehicle.id}</p>
                <p className="text-xs text-muted-foreground truncate">{vehicle.driver}</p>
                <Badge variant="outline" className={`mt-2 text-xs ${getStatusBadge(vehicle.status)}`}>
                  {vehicle.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
