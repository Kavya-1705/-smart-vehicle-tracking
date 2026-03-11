import { useState, useMemo } from 'react';
import { 
  Car, 
  Search, 
  Filter, 
  MapPin, 
  Gauge, 
  User,
  MoreHorizontal,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Vehicle } from '@/types';
import { dummyVehicles } from '@/data/dummyData';

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

export function FleetManagement() {
  const [vehicles] = useState<Vehicle[]>(dummyVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: vehicles.length,
      Active: vehicles.filter(v => v.status === 'Active').length,
      Idle: vehicles.filter(v => v.status === 'Idle').length,
      Accident: vehicles.filter(v => v.status === 'Accident').length,
      Offline: vehicles.filter(v => v.status === 'Offline').length,
    };
  }, [vehicles]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Manage and monitor all vehicles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="status-active">
            {statusCounts.Active} Active
          </Badge>
          <Badge variant="outline" className="status-idle">
            {statusCounts.Idle} Idle
          </Badge>
          <Badge variant="outline" className="status-accident">
            {statusCounts.Accident} Accident
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle ID, driver, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                  <SelectItem value="Active">Active ({statusCounts.Active})</SelectItem>
                  <SelectItem value="Idle">Idle ({statusCounts.Idle})</SelectItem>
                  <SelectItem value="Accident">Accident ({statusCounts.Accident})</SelectItem>
                  <SelectItem value="Offline">Offline ({statusCounts.Offline})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Vehicle List
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredVehicles.length} vehicles)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Vehicle ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Speed</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Safety Score</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Last Updated</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle, index) => (
                  <tr 
                    key={vehicle.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Car className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{vehicle.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{vehicle.driver}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={getStatusBadge(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{vehicle.location.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-muted-foreground" />
                        <span>{vehicle.speed} km/h</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              vehicle.safetyScore >= 90 ? 'bg-emerald-500' :
                              vehicle.safetyScore >= 80 ? 'bg-blue-500' :
                              vehicle.safetyScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${vehicle.safetyScore}%` }}
                          />
                        </div>
                        <span className="text-sm">{vehicle.safetyScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Navigation className="w-3 h-3" />
                        <span className="text-sm">{formatTime(vehicle.lastUpdated)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Track Vehicle</DropdownMenuItem>
                          <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">Report Issue</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No vehicles found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
