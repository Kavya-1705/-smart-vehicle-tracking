import type { Vehicle, Alert, Driver, Settings } from '@/types';

export const dummyVehicles: Vehicle[] = [
  {
    id: 'VH001',
    driver: 'Raj Kumar',
    status: 'Active',
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
    speed: 62,
    lastUpdated: new Date().toISOString(),
    safetyScore: 92
  },
  {
    id: 'VH002',
    driver: 'Priya Shah',
    status: 'Accident',
    location: { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra' },
    speed: 0,
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(),
    safetyScore: 78
  },
  {
    id: 'VH003',
    driver: 'Amit Patel',
    status: 'Active',
    location: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
    speed: 78,
    lastUpdated: new Date().toISOString(),
    safetyScore: 88
  },
  {
    id: 'VH004',
    driver: 'Sneha Joshi',
    status: 'Idle',
    location: { lat: 21.1702, lng: 72.8311, address: 'Surat, Gujarat' },
    speed: 0,
    lastUpdated: new Date(Date.now() - 30 * 60000).toISOString(),
    safetyScore: 95
  },
  {
    id: 'VH005',
    driver: 'Vikram Singh',
    status: 'Active',
    location: { lat: 28.6139, lng: 77.2090, address: 'Delhi, NCR' },
    speed: 55,
    lastUpdated: new Date().toISOString(),
    safetyScore: 85
  },
  {
    id: 'VH006',
    driver: 'Neha Gupta',
    status: 'Active',
    location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
    speed: 70,
    lastUpdated: new Date().toISOString(),
    safetyScore: 90
  }
];

export const dummyAlerts: Alert[] = [
  {
    id: 'ALT001',
    vehicleId: 'VH002',
    driver: 'Priya Shah',
    location: { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra' },
    severity: 'High',
    time: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'Pending',
    type: 'Accident',
    description: 'Vehicle collision detected at intersection'
  },
  {
    id: 'ALT002',
    vehicleId: 'VH001',
    driver: 'Raj Kumar',
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
    severity: 'Medium',
    time: new Date(Date.now() - 45 * 60000).toISOString(),
    status: 'Pending',
    type: 'Overspeed',
    description: 'Speed limit exceeded by 15 km/h'
  },
  {
    id: 'ALT003',
    vehicleId: 'VH003',
    driver: 'Amit Patel',
    location: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
    severity: 'High',
    time: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    status: 'Resolved',
    type: 'Emergency',
    description: 'Emergency button pressed by driver'
  },
  {
    id: 'ALT004',
    vehicleId: 'VH005',
    driver: 'Vikram Singh',
    location: { lat: 28.6139, lng: 77.2090, address: 'Delhi, NCR' },
    severity: 'Low',
    time: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    status: 'Resolved',
    type: 'Geofence',
    description: 'Vehicle exited designated geofence area'
  },
  {
    id: 'ALT005',
    vehicleId: 'VH006',
    driver: 'Neha Gupta',
    location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
    severity: 'Medium',
    time: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    status: 'Pending',
    type: 'Overspeed',
    description: 'Speed limit exceeded by 10 km/h'
  },
  {
    id: 'ALT006',
    vehicleId: 'VH004',
    driver: 'Sneha Joshi',
    location: { lat: 21.1702, lng: 72.8311, address: 'Surat, Gujarat' },
    severity: 'High',
    time: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    status: 'Resolved',
    type: 'Accident',
    description: 'Minor collision detected'
  },
  {
    id: 'ALT007',
    vehicleId: 'VH001',
    driver: 'Raj Kumar',
    location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
    severity: 'Low',
    time: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
    status: 'Resolved',
    type: 'Geofence',
    description: 'Vehicle entered restricted zone'
  },
  {
    id: 'ALT008',
    vehicleId: 'VH003',
    driver: 'Amit Patel',
    location: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
    severity: 'Medium',
    time: new Date(Date.now() - 8 * 60 * 60000).toISOString(),
    status: 'Pending',
    type: 'Emergency',
    description: 'Harsh braking detected'
  },
  {
    id: 'ALT009',
    vehicleId: 'VH005',
    driver: 'Vikram Singh',
    location: { lat: 28.6139, lng: 77.2090, address: 'Delhi, NCR' },
    severity: 'Low',
    time: new Date(Date.now() - 12 * 60 * 60000).toISOString(),
    status: 'Resolved',
    type: 'Overspeed',
    description: 'Speed limit exceeded by 5 km/h'
  },
  {
    id: 'ALT010',
    vehicleId: 'VH006',
    driver: 'Neha Gupta',
    location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
    severity: 'Medium',
    time: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    status: 'Resolved',
    type: 'Geofence',
    description: 'Vehicle exited designated route'
  }
];

export const dummyDrivers: Driver[] = [
  { id: 'DRV001', name: 'Sneha Joshi', safetyScore: 95, trips: 245, distance: 12500, violations: 2 },
  { id: 'DRV002', name: 'Raj Kumar', safetyScore: 92, trips: 312, distance: 18900, violations: 5 },
  { id: 'DRV003', name: 'Neha Gupta', safetyScore: 90, trips: 198, distance: 9800, violations: 3 },
  { id: 'DRV004', name: 'Amit Patel', safetyScore: 88, trips: 276, distance: 15400, violations: 7 },
  { id: 'DRV005', name: 'Vikram Singh', safetyScore: 85, trips: 189, distance: 11200, violations: 6 },
  { id: 'DRV006', name: 'Priya Shah', safetyScore: 78, trips: 156, distance: 8700, violations: 9 }
];

export const defaultSettings: Settings = {
  emergencyContact: '+91 98765 43210',
  geofenceRadius: 5,
  smsAlerts: true,
  emailAlerts: true,
  pushNotifications: false
};

export const accidentsPerMonth = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 6 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 8 },
  { month: 'May', count: 5 },
  { month: 'Jun', count: 7 },
  { month: 'Jul', count: 4 },
  { month: 'Aug', count: 6 },
  { month: 'Sep', count: 9 },
  { month: 'Oct', count: 5 },
  { month: 'Nov', count: 3 },
  { month: 'Dec', count: 4 }
];

export const severityDistribution = [
  { name: 'High', value: 3, color: '#EF4444' },
  { name: 'Medium', value: 4, color: '#F97316' },
  { name: 'Low', value: 3, color: '#EAB308' }
];
