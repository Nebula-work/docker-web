import { AppShell } from "@mantine/core";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <AppShell
            navbar={{ width: 250, breakpoint: 'sm' }}
            className="min-h-screen bg-background"
        >
            <AppShell.Navbar>
                <AppSidebar />
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}