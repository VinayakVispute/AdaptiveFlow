
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import { NotificationHistoryProvider } from "@/context/NotificationHistoryContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NotificationHistoryProvider>
            <DashboardNavbar />
            <div className="flex flex-col h-screen bg-white text-black mb-8">
                {children}
            </div>
        </NotificationHistoryProvider>
    );
}