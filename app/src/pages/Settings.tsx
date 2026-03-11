import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Phone, 
  MapPin, 
  Bell, 
  Mail, 
  MessageSquare,
  Shield,
  Save,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { defaultSettings } from '@/data/dummyData';
import type { Settings as SettingsType } from '@/types';

export function Settings() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to Firebase
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and alerts</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="status-amber">
              Unsaved Changes
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Emergency Contact
            </CardTitle>
            <CardDescription>
              Primary contact for emergency alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergency-contact">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="emergency-contact"
                  value={settings.emergencyContact}
                  onChange={(e) => updateSetting('emergencyContact', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This number will receive SMS alerts for high-severity incidents
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Geofence Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Geofence Configuration
            </CardTitle>
            <CardDescription>
              Set the default radius for geofence monitoring zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="geofence-radius">Default Radius</Label>
                <span className="text-sm font-medium">{settings.geofenceRadius} km</span>
              </div>
              <input
                id="geofence-radius"
                type="range"
                min="1"
                max="50"
                step="1"
                value={settings.geofenceRadius}
                onChange={(e) => updateSetting('geofenceRadius', Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Vehicles crossing this boundary will trigger a geofence alert
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* SMS Alerts */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="sms-alerts" className="font-medium">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages</p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={settings.smsAlerts}
                    onCheckedChange={(checked) => updateSetting('smsAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>High severity alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Accident notifications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Emergency button presses</span>
                  </div>
                </div>
              </div>

              {/* Email Alerts */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="email-alerts" className="font-medium">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications</p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={settings.emailAlerts}
                    onCheckedChange={(checked) => updateSetting('emailAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Daily summary reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Weekly analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>All alert types</span>
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Real-time alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Geofence breaches</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Speed violations</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">System Version</p>
                <p className="font-medium">v2.4.1</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Database Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="font-medium text-emerald-400">Connected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={!hasChanges}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Changes
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
