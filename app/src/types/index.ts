export interface Vehicle {
  id: string;
  driver: string;
  status: 'Active' | 'Idle' | 'Accident' | 'Offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number;
  lastUpdated: string;
  safetyScore: number;
}

export interface Alert {
  id: string;
  vehicleId: string;
  driver: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'Low' | 'Medium' | 'High';
  time: string;
  status: 'Pending' | 'Resolved';
  type: 'Accident' | 'Overspeed' | 'Geofence' | 'Emergency';
  description: string;
}

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  safetyScore: number;
  trips: number;
  distance: number;
  violations: number;
}

export interface AnalyticsData {
  accidentsPerMonth: { month: string; count: number }[];
  severityDistribution: { name: string; value: number; color: string }[];
  driverRankings: Driver[];
}

export interface Settings {
  emergencyContact: string;
  geofenceRadius: number;
  smsAlerts: boolean;
  emailAlerts: boolean;
  pushNotifications: boolean;
}
