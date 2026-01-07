import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { TopBar } from '@/components/top-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <TopBar />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
