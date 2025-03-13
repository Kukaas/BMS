import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { logout } from "@/redux/user/userSlice";
import { motion } from "framer-motion";
import {
    ChevronRight,
    FileText,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function Sidebar() {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const currentTab = new URLSearchParams(location.search).get("tab");

    let sidebarItems = [];

    if (currentUser?.role === "superAdmin") {
        sidebarItems = [
            {
                icon: LayoutDashboard,
                label: "Overview",
                href: "/dashboard?tab=overview",
            },
            { icon: User2Icon, label: "Register", href: "/dashboard?tab=register" },
            { icon: Users, label: "All Users", href: "/dashboard?tab=allusers" },
            { icon: FileText, label: "Logs", href: "/dashboard?tab=logs" },
        ];
    } else if (currentUser?.role === "user") {
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
        ];
    } else if (currentUser?.role === "secretary" || currentUser?.role === "chairman") {
        sidebarItems = [
            {
                icon: LayoutDashboard,
                label: "Overview",
                href: "/dashboard?tab=overview",
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
                icon: FileText,
                label: "Blotter Report",
                href: "/dashboard?tab=blotterreports",
            },
            {
                icon: User2Icon,
                label: "Residents",
                href: "/dashboard?tab=residents",
            },
            {
                icon: User2Icon,
                label: "Users List",
                href: "/dashboard?tab=userlist",
            },
        ];
    }

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            const res = await api.post(`/auth/logout/${currentUser._id}`);

            if (res.status === 200) {
                console.log("Logout successful");
                localStorage.removeItem("token");
                dispatch(logout());
                navigate("/sign-in");
                toast.success("Logged out successfully");
            }
        } catch (error) {
            console.error("Logout error:", error);
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
                        <TooltipProvider delayDuration={0}>
                            {sidebarItems.map((item) => (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            to={item.href}
                                            className={cn(
                                                "flex items-center w-full py-2 px-3 rounded-lg transition-colors",
                                                currentTab === item.href.split("=")[1]
                                                    ? "bg-gray-100 text-black font-semibold"
                                                    : "text-white hover:bg-green-600",
                                                isCollapsed && "justify-center px-2"
                                            )}
                                        >
                                            <div className="flex-shrink-0">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            {!isCollapsed && (
                                                <span className="ml-3">{item.label}</span>
                                            )}
                                            {!isCollapsed &&
                                                currentTab === item.href.split("=")[1] && (
                                                    <ChevronRight className="ml-auto h-4 w-4" />
                                                )}
                                        </Link>
                                    </TooltipTrigger>
                                    {isCollapsed && (
                                        <TooltipContent
                                            side="right"
                                            className="bg-green-800 text-white border-0"
                                        >
                                            {item.label}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            ))}
                        </TooltipProvider>
                    </div>
                </nav>
            </ScrollArea>

            {/* Logout Button */}
            <div className="p-4 border-t">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full text-white hover:bg-green-600",
                                            isCollapsed ? "justify-center px-2" : "justify-start"
                                        )}
                                    >
                                        <div className="flex-shrink-0">
                                            <LogOut className="h-5 w-5" />
                                        </div>
                                        {!isCollapsed && <span className="ml-3">Logout</span>}
                                    </Button>
                                </TooltipTrigger>
                                {isCollapsed && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-green-800 text-white border-0"
                                    >
                                        Logout
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white max-w-md w-[90%] sm:w-[400px] p-6">
                        <AlertDialogHeader className="space-y-3">
                            <AlertDialogTitle className="text-xl font-semibold">
                                Confirm Logout
                            </AlertDialogTitle>
                            <p className="text-gray-500 text-sm">
                                Are you sure you want to logout? You will need to sign in again to
                                access your account.
                            </p>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="border-gray-200 hover:bg-gray-100 hover:text-gray-900">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                            >
                                {loggingOut ? (
                                    <>
                                        <span className="animate-pulse">Logging out</span>
                                        <span className="ml-1 animate-pulse">...</span>
                                    </>
                                ) : (
                                    "Logout"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </motion.div>
    );
}
