const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (simulating Firebase)
let vehicles = [
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

let alerts = [
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

let settings = {
  emergencyContact: '+91 98765 43210',
  geofenceRadius: 5,
  smsAlerts: true,
  emailAlerts: true,
  pushNotifications: false
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Vehicles
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(vehicle);
});

app.put('/api/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  vehicles[index] = { ...vehicles[index], ...req.body, lastUpdated: new Date().toISOString() };
  res.json(vehicles[index]);
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.get('/api/alerts/:id', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
});

app.put('/api/alerts/:id', (req, res) => {
  const index = alerts.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  alerts[index] = { ...alerts[index], ...req.body };
  res.json(alerts[index]);
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const index = alerts.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  alerts[index].status = 'Resolved';
  res.json(alerts[index]);
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Analytics
app.get('/api/analytics/accidents', (req, res) => {
  const accidentsPerMonth = [
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
  res.json(accidentsPerMonth);
});

app.get('/api/analytics/severity', (req, res) => {
  const severityDistribution = [
    { name: 'High', value: 3, color: '#EF4444' },
    { name: 'Medium', value: 4, color: '#F97316' },
    { name: 'Low', value: 3, color: '#EAB308' }
  ];
  res.json(severityDistribution);
});

app.get('/api/analytics/drivers', (req, res) => {
  const drivers = [
    { id: 'DRV001', name: 'Sneha Joshi', safetyScore: 95, trips: 245, distance: 12500, violations: 2 },
    { id: 'DRV002', name: 'Raj Kumar', safetyScore: 92, trips: 312, distance: 18900, violations: 5 },
    { id: 'DRV003', name: 'Neha Gupta', safetyScore: 90, trips: 198, distance: 9800, violations: 3 },
    { id: 'DRV004', name: 'Amit Patel', safetyScore: 88, trips: 276, distance: 15400, violations: 7 },
    { id: 'DRV005', name: 'Vikram Singh', safetyScore: 85, trips: 189, distance: 11200, violations: 6 },
    { id: 'DRV006', name: 'Priya Shah', safetyScore: 78, trips: 156, distance: 8700, violations: 9 }
  ];
  res.json(drivers);
});

// WebSocket simulation for real-time updates
let clients = [];

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Simulate real-time vehicle updates
setInterval(() => {
  // Randomly update vehicle positions
  vehicles = vehicles.map(vehicle => {
    if (vehicle.status === 'Active' && Math.random() > 0.7) {
      return {
        ...vehicle,
        location: {
          ...vehicle.location,
          lat: vehicle.location.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.location.lng + (Math.random() - 0.5) * 0.001,
        },
        speed: Math.max(0, Math.min(120, vehicle.speed + Math.floor((Math.random() - 0.5) * 10))),
        lastUpdated: new Date().toISOString()
      };
    }
    return vehicle;
  });

  // Send updates to connected clients
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ type: 'vehicles', data: vehicles })}\n\n`);
  });
}, 5000);

// Start server
app.listen(PORT, () => {
  console.log(`Fleet Monitoring Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/vehicles`);
  console.log(`  GET  /api/alerts`);
  console.log(`  GET  /api/settings`);
  console.log(`  GET  /api/analytics/accidents`);
  console.log(`  GET  /api/analytics/severity`);
  console.log(`  GET  /api/analytics/drivers`);
});

module.exports = app;
