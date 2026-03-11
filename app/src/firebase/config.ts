import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForFleetMonitoring12345",
  authDomain: "fleet-monitoring-demo.firebaseapp.com",
  projectId: "fleet-monitoring-demo",
  storageBucket: "fleet-monitoring-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
