import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/redux/user/userSlice";
import api from "@/lib/axios";
import { Bell, Menu, Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationsPopover } from "./NotificationsPopover";

export function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await api.post("/auth/logout", {
                id: currentUser._id,
            });

            if (res.status === 200) {
                localStorage.removeItem("token");
                dispatch(logout());
                navigate("/sign-in");
                toast.success("Logged out successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later");
        }
    };

    return (
        <header className="bg-green-700 border-b px-0 py-3 sticky top-0 z-10">
            <div className="flex items-center sm:justify-between">
                <div className="flex items-center gap-4 w-full max-w-[300px] sm:max-w-md pl-3">
                    <SidebarTrigger>
                        <div className="p-2 hover:bg-green-600 rounded-md cursor-pointer">
                            <Menu className="h-5 w-5 text-white" />
                        </div>
                    </SidebarTrigger>
                    <div className="relative w-full pr-4">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input type="search" placeholder="Search..." className="pl-8 w-full" />
                    </div>
                </div>
                <div className="flex items-center space-x-4 mx-4">
                    <NotificationsPopover />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/01.png" alt={currentUser?.name} />
                                    <AvatarFallback>
                                        {currentUser?.name
                                            ? currentUser.name[0].toUpperCase()
                                            : "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {currentUser?.name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {currentUser?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
