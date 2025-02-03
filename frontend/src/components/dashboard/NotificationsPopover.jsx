import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Loader2, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService } from "@/services/notification.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";

export function NotificationsPopover() {
    const user = useSelector((state) => state.user.currentUser);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMarkingRead, setIsMarkingRead] = useState(false);
    const navigate = useNavigate();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await notificationService.getNotifications();
            const notifs = response.data.notifications || [];
            setNotifications(notifs);
            // Count unread notifications directly from the array
            const unreadNotifs = notifs.filter((notif) => !notif.read).length;
            setUnreadCount(unreadNotifs);
        } catch (error) {
            toast.error("Failed to fetch notifications");
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and setup interval
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Refetch every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                setIsMarkingRead(true);
                await notificationService.markAsRead([notification._id]);
                // Update the local unread count immediately
                setUnreadCount((prev) => Math.max(0, prev - 1));
                // Update the notifications list
                setNotifications((prevNotifications) =>
                    prevNotifications.map((n) =>
                        n._id === notification._id ? { ...n, read: true } : n
                    )
                );
            }
        } catch (error) {
            toast.error("Failed to mark as read");
            console.error("Error marking as read:", error);
            // Refresh notifications to ensure sync with server
            await fetchNotifications();
        } finally {
            setIsMarkingRead(false);
        }

        // Handle navigation based on notification type and user role
        if (notification.type === "request") {
            // For request notifications, navigate based on user role
            const dashboardPath =
                user?.role === "secretary" || user?.role === "chairman"
                    ? "/dashboard?tab=requestdocs"
                    : "/dashboard?tab=requests";
            navigate(dashboardPath);
        } else if (notification.type === "status_update") {
            // For status updates, navigate based on document type
            let path = "/dashboard?tab=requests"; // Default path for users

            // Handle different document types
            if (
                notification.docModel === "IncidentReport" ||
                notification.docModel === "BlotterReport"
            ) {
                path = "/dashboard?tab=incidents";
            } else if (user?.role === "secretary" || user?.role === "chairman") {
                path = "/dashboard?tab=requestdocs";
            }
            navigate(path);
        } else if (notification.type === "report") {
            // For report notifications, navigate to incidents tab
            navigate("/dashboard?tab=incidents");
        }

        setOpen(false);
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            setIsMarkingRead(true);
            await notificationService.markAsRead([]);
            await fetchNotifications();
            toast.success("Marked all as read");
        } catch (error) {
            toast.error("Failed to mark all as read");
            console.error("Error marking all as read:", error);
        } finally {
            setIsMarkingRead(false);
        }
    };

    // Handle delete notification
    const handleDeleteNotification = async (e, notificationId) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(notificationId);
            await fetchNotifications();
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
            console.error("Error deleting notification:", error);
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "request":
                return "📝";
            case "status_update":
                return "📊";
            case "verification":
                return "✅";
            case "document":
                return "📄";
            default:
                return "🔔";
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-white/10 transition-colors"
                >
                    <Bell className="h-5 w-5 text-white" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0 || isMarkingRead}
                    >
                        {isMarkingRead ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            "Mark all as read"
                        )}
                    </Button>
                </div>
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications
                                .slice()
                                .reverse()
                                .map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={cn(
                                            "flex items-start gap-3 p-4 hover:bg-muted transition-colors cursor-pointer relative group",
                                            !notification.read && "bg-muted/50"
                                        )}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="text-xl">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(notification.createdAt), "PPp")}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) =>
                                                handleDeleteNotification(e, notification._id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}