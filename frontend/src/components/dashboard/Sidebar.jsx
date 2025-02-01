import { cn } from "@/lib/utils";
import { logout } from "@/redux/user/userSlice";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import {
    ChevronRight,
    FileText,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    User2Icon,
    Users,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export function Sidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const currentTab = new URLSearchParams(location.search).get("tab");

    let sidebarItems = [];

    if (currentUser?.role === "user") {
        sidebarItems = [
            {
                icon: LayoutDashboard,
                label: "Overview",
                href: "/dashboard?tab=overview",
            },
            { icon: Mail, label: "Requests", href: "/dashboard?tab=requests" },
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
            { icon: HelpCircle, label: "Settings", href: "/dashboard?tab=settings" },
        ];
    } else if (currentUser?.role === "secretary" || currentUser?.role === "chairman") {
        sidebarItems = [
            {
                icon: LayoutDashboard,
                label: "Overview",
                href: "/dashboard?tab=overview",
            },
            { icon: Users, label: "Users", href: "/dashboard?tab=users" },
            {
                icon: Mail,
                label: "Request",
                href: "/dashboard?tab=request-admin",
            },
            {
                icon: FileText,
                label: "Incident Report",
                href: "/dashboard?tab=incident-report-admin",
            },
            { icon: User2Icon, label: "Residents", href: "/dashboard?tab=residents" },
        ];
    }

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            const res = await api.post("/auth/logout");

            if (res.status === 200) {
                dispatch(logout());
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

    return (
        <motion.div
            className={cn(
                "flex flex-col h-screen bg-green-700 border-r shadow-sm text-white",
                isCollapsed ? "w-16" : "w-64"
            )}
            animate={{ width: isCollapsed ? "64px" : "256px" }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                {!isCollapsed && (
                    <span className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        BMS
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto text-white hover:bg-green-600"
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            {/* Navigation Items */}
            <ScrollArea className="flex-1">
                <nav className="p-2">
                    <div className="space-y-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center w-full py-2 px-3 rounded-lg transition-colors",
                                    currentTab === item.href.split("=")[1]
                                        ? "bg-gray-100 text-black font-semibold"
                                        : "text-white hover:bg-green-600"
                                )}
                            >
                                <item.icon
                                    className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")}
                                />
                                {!isCollapsed && <span>{item.label}</span>}
                                {!isCollapsed && currentTab === item.href.split("=")[1] && (
                                    <ChevronRight className="ml-auto h-4 w-4" />
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>
            </ScrollArea>

            {/* Logout Button */}
            <div className="p-4 border-t">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full text-white hover:bg-green-600 justify-start"
                        >
                            <LogOut className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                            {!isCollapsed && <span>Logout</span>}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
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
        </motion.div>
    );
}
