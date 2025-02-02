import { Requests } from "@/components/dashboard/Requests.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import BlotterReportPage from "@/pages/BlotterReportPage";
import IncidentReportSecretaryPage from "@/pages/incident-report.jsx";
import IncidentReportsPage from "@/pages/IncidentReportsPage";
import { logout } from "@/redux/user/userSlice";
import axios from "axios";
import { FileText, LayoutDashboard, LogOut, Mail, Settings, Users } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "./Header";
import Overview from "./Overview";
import { DocumentRequestSecretary } from "./secretary/DocumentRequestSecretary";
import { UserList } from "./UserList";

const componentMap = {
    overview: Overview,
    users: UserList,
    home: Overview,
    requests: Requests,
    reports: IncidentReportsPage,
    blotter: BlotterReportPage,
    incidents: IncidentReportSecretaryPage,
    requestdocs: DocumentRequestSecretary,
    // settings: Settings,
    // help: Help,
};

function Dashboard({ tab }) {
    const ComponentToRender = componentMap[tab] || Overview;
    const [loggingOut, setLoggingOut] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            const res = await axios.post("http://localhost:5000/api/auth/logout");

            if (res.status === 200) {
                dispatch(logout());
                localStorage.removeItem("token");
                navigate("/sign-in");
                toast.success("Logged out successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later");
        } finally {
            setLoggingOut(false);
        }
    };

    const sidebarItems =
        currentUser?.role === "user"
            ? [
                  {
                      icon: LayoutDashboard,
                      label: "Overview",
                      href: "/dashboard?tab=overview",
                  },
                  {
                      icon: Mail,
                      label: "Requests",
                      href: "/dashboard?tab=requests",
                  },
                  {
                      icon: FileText,
                      label: "Incident reports",
                      href: "/dashboard?tab=reports",
                  },
                  {
                      icon: FileText,
                      label: "Blotter Report",
                      href: "/dashboard?tab=blotter",
                  },
                  {
                      icon: Settings,
                      label: "Settings",
                      href: "/dashboard?tab=settings",
                  },
              ]
            : [
                  {
                      icon: LayoutDashboard,
                      label: "Overview",
                      href: "/dashboard?tab=overview",
                  },
                  {
                      icon: Users,
                      label: "Users",
                      href: "/dashboard?tab=users",
                  },
                  {
                      icon: Mail,
                      label: "Request",
                      href: "/dashboard?tab=requestdocs",
                  },
                  {
                      icon: FileText,
                      label: "Incident Report",
                      href: "/dashboard?tab=incidents",
                  },
                  {
                      icon: Users,
                      label: "Residents",
                      href: "/dashboard?tab=residents",
                  },
              ];

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="fixed inset-0 flex bg-gray-100">
                <Sidebar collapsible="icon" className="border-r border-green-800 bg-green-700">
                    <SidebarHeader className="border-b border-green-800 p-4 flex items-center justify-between bg-green-700 h-[60px]">
                        <div className="min-h-[28px] flex items-center">
                            <span className="text-2xl font-semibold text-white group-data-[collapsible=icon]:opacity-0">
                                BMS
                            </span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="bg-green-700 flex flex-col h-full">
                        <SidebarMenu className="bg-green-700 p-2 space-y-2 flex-1">
                            {sidebarItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={tab === item.href.split("=")[1]}
                                        tooltip={item.label}
                                        className={cn(
                                            "text-white hover:bg-green-600 transition-colors rounded-lg p-2",
                                            tab === item.href.split("=")[1] &&
                                                "bg-green-600 text-white font-semibold"
                                        )}
                                    >
                                        <Link to={item.href} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4 flex-shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                        {/* Logout Section */}
                        <div className="p-2 mt-auto border-t border-green-800">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip="Logout"
                                        className="w-full text-white hover:bg-green-600 transition-colors rounded-lg p-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut className="h-4 w-4 flex-shrink-0" />
                                            <span>Logout</span>
                                        </div>
                                    </SidebarMenuButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure you want to logout?
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            {loggingOut ? "Logging out..." : "Yes, Logout"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </SidebarContent>
                </Sidebar>
                <div className="flex-1 flex flex-col min-h-0">
                    <Header />
                    <main className="flex-1 min-h-0 h-screen overflow-y-auto p-8 my-auto bg-gradient-to-b from-gray-100 to-gray-200">
                        <ComponentToRender />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default Dashboard;
