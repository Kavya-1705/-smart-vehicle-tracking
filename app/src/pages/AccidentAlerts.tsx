import { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Car,
  User,
  Filter,
  AlertOctagon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Alert } from '@/types';
import { dummyAlerts } from '@/data/dummyData';

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
  return date.toLocaleDateString();
}

function getAlertTypeIcon(type: string) {
  switch (type) {
    case 'Accident':
      return <AlertOctagon className="w-4 h-4" />;
    case 'Overspeed':
      return <Car className="w-4 h-4" />;
    case 'Geofence':
      return <MapPin className="w-4 h-4" />;
    case 'Emergency':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
}

export function AccidentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(dummyAlerts);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  const handleResolve = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDialogOpen(true);
  };

  const confirmResolve = () => {
    if (selectedAlert) {
      setAlerts(alerts.map(alert => 
        alert.id === selectedAlert.id 
          ? { ...alert, status: 'Resolved' as const }
          : alert
      ));
      setIsDialogOpen(false);
      setSelectedAlert(null);
    }
  };

  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'Pending').length,
    resolved: alerts.filter(a => a.status === 'Resolved').length,
    high: alerts.filter(a => a.severity === 'High').length,
    medium: alerts.filter(a => a.severity === 'Medium').length,
    low: alerts.filter(a => a.severity === 'Low').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Accident Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage all safety alerts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Alerts</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.resolved}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.high}</p>
            <p className="text-xs text-muted-foreground">High Severity</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-orange-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{stats.medium}</p>
            <p className="text-xs text-muted-foreground">Medium Severity</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.low}</p>
            <p className="text-xs text-muted-foreground">Low Severity</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => (
          <Card 
            key={alert.id} 
            className={`card-hover animate-slide-in ${alert.status === 'Pending' ? 'border-l-4 border-l-primary' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Alert Icon & Severity */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityBadge(alert.severity)}`}>
                    {getAlertTypeIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{alert.id}</span>
                      <Badge variant="outline" className={getSeverityBadge(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.type}</p>
                  </div>
                </div>

                {/* Vehicle & Driver */}
                <div className="flex items-center gap-4 lg:flex-1">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{alert.vehicleId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{alert.driver}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground lg:w-48">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{alert.location.address}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatTime(alert.time)}
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={alert.status === 'Pending' ? 'status-accident' : 'status-active'}
                  >
                    {alert.status}
                  </Badge>
                  {alert.status === 'Pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleResolve(alert)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="text-lg font-medium">No alerts found</p>
              <p className="text-muted-foreground">All alerts have been resolved or filtered out</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this alert as resolved?
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4">
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Alert ID</span>
                  <span className="font-medium">{selectedAlert.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vehicle</span>
                  <span className="font-medium">{selectedAlert.vehicleId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Severity</span>
                  <Badge variant="outline" className={getSeverityBadge(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmResolve} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Confirm Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
