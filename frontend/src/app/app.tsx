import { useState } from 'react';
import AppShell, { type PageId, type PortalId } from 'components/organisms/AppShell';
import DashboardScreen         from 'components/organisms/screens/DashboardScreen';
import AttendanceRosterScreen  from 'components/organisms/screens/AttendanceRosterScreen';
import DemandBoardScreen       from 'components/organisms/screens/DemandBoardScreen';
import KitchenShiftScreen      from 'components/organisms/screens/KitchenShiftScreen';
import StudentDirectoryScreen  from 'components/organisms/screens/StudentDirectoryScreen';

const DEFAULT_PAGE: Record<PortalId, PageId> = {
  admin:   'dashboard',
  teacher: 'attendance',
  manager: 'demand',
  kitchen: 'kitchen',
};

function renderScreen(page: PageId) {
  switch (page) {
    case 'dashboard':  return <DashboardScreen />;
    case 'attendance': return <AttendanceRosterScreen />;
    case 'demand':     return <DemandBoardScreen />;
    case 'kitchen':    return <KitchenShiftScreen />;
    case 'students':   return <StudentDirectoryScreen />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-64 text-[var(--color-text-muted)]">
          <p className="text-lg font-medium mb-1">Màn hình đang phát triển</p>
          <p className="text-sm">Prototype sẽ được cập nhật trong sprint tiếp theo.</p>
        </div>
      );
  }
}

export default function App() {
  const [portal, setPortal] = useState<PortalId>('admin');
  const [page,   setPage]   = useState<PageId>('dashboard');

  function handlePortalChange(newPortal: PortalId) {
    setPortal(newPortal);
    setPage(DEFAULT_PAGE[newPortal]);
  }

  return (
    <AppShell
      activePage={page}
      activePortal={portal}
      onNavigate={setPage}
      onPortalChange={handlePortalChange}
    >
      {renderScreen(page)}
    </AppShell>
  );
}
