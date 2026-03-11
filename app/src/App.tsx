import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { FleetManagement } from '@/pages/FleetManagement';
import { AccidentAlerts } from '@/pages/AccidentAlerts';
import { LiveTracking } from '@/pages/LiveTracking';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'fleet':
        return <FleetManagement />;
      case 'alerts':
        return <AccidentAlerts />;
      case 'tracking':
        return <LiveTracking />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
      <Toaster />
    </Layout>
  );
}

export default App;
