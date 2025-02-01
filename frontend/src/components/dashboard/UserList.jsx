import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MoreHorizontal, XCircle, UserX, UserCheck, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const LoadingOverlay = ({ message }) => (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-[2px] z-50">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    </div>
);

export function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [actionLoading, setActionLoading] = useState({
        verifying: false,
        rejecting: false,
        deactivating: false,
        activating: false,
        userId: null,
    });
    const [deactivateDialog, setDeactivateDialog] = useState({
        isOpen: false,
        userId: null,
        reason: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users/barangay", {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.role === "secretary" || currentUser?.role === "chairman") {
            fetchUsers();
        }
    }, [currentUser]);

    const handleVerifyUser = async (userId) => {
        try {
            setActionLoading({
                verifying: true,
                rejecting: false,
                deactivating: false,
                activating: false,
                userId,
            });
            const res = await axios.patch(
                `http://localhost:5000/api/users/${userId}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("User verified successfully");
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify user");
        } finally {
            setActionLoading({
                verifying: false,
                rejecting: false,
                deactivating: false,
                activating: false,
                userId: null,
            });
        }
    };

    const handleRejectUser = async (userId) => {
        try {
            setActionLoading({
                verifying: false,
                rejecting: true,
                deactivating: false,
                activating: false,
                userId,
            });
            const res = await axios.patch(
                `http://localhost:5000/api/users/${userId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("User rejected successfully");
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reject user");
        } finally {
            setActionLoading({
                verifying: false,
                rejecting: false,
                deactivating: false,
                activating: false,
                userId: null,
            });
        }
    };

    const handleDeactivateUser = async () => {
        try {
            setActionLoading({
                verifying: false,
                rejecting: false,
                deactivating: true,
                activating: false,
                userId: deactivateDialog.userId,
            });

            const res = await axios.patch(
                `http://localhost:5000/api/users/${deactivateDialog.userId}/deactivate`,
                { reason: deactivateDialog.reason },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("User deactivated successfully");
                fetchUsers();
                setDeactivateDialog({ isOpen: false, userId: null, reason: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to deactivate user");
        } finally {
            setActionLoading({
                verifying: false,
                rejecting: false,
                deactivating: false,
                activating: false,
                userId: null,
            });
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            setActionLoading({
                verifying: false,
                rejecting: false,
                deactivating: false,
                activating: true,
                userId,
            });
            const res = await axios.patch(
                `http://localhost:5000/api/users/${userId}/activate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("User activated successfully");
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to activate user");
        } finally {
            setActionLoading({
                verifying: false,
                rejecting: false,
                deactivating: false,
                activating: false,
                userId: null,
            });
        }
    };

    const isActionLoading = () => {
        return (
            actionLoading.verifying ||
            actionLoading.rejecting ||
            actionLoading.deactivating ||
            actionLoading.activating
        );
    };

    const getLoadingMessage = () => {
        if (actionLoading.verifying) return "Verifying user...";
        if (actionLoading.rejecting) return "Rejecting user...";
        if (actionLoading.deactivating) return "Deactivating user...";
        if (actionLoading.activating) return "Activating user...";
        return "Loading...";
    };

    const filteredUsers = [...users]
        .filter((user) => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.role.toLowerCase().includes(searchLower) ||
                user.barangay.toLowerCase().includes(searchLower)
            );
        })
        .sort((a, b) => {
            if (a.isActive !== b.isActive) {
                return b.isActive ? 1 : -1;
            }
            return a.name.localeCompare(b.name);
        });

    const lastItemIndex = currentPage * pageSize;
    const firstItemIndex = lastItemIndex - pageSize;
    const currentItems = filteredUsers.slice(firstItemIndex, lastItemIndex);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[300px]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={pageSize.toString()}
                                onValueChange={handlePageSizeChange}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 30, 40, 50].map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">per page</span>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Barangay</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((user) => (
                                    <TableRow
                                        key={user._id}
                                        className={!user.isActive ? "opacity-60" : ""}
                                    >
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell>{user.barangay}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.isVerified ? "default" : "secondary"}
                                                className={
                                                    user.isVerified
                                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                        : ""
                                                }
                                            >
                                                {user.isVerified ? "Verified" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.isActive ? "outline" : "destructive"}
                                            >
                                                {user.isActive ? "Active" : "Deactivated"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleVerifyUser(user._id)}
                                                        disabled={
                                                            actionLoading.verifying ||
                                                            actionLoading.rejecting ||
                                                            actionLoading.deactivating ||
                                                            actionLoading.activating ||
                                                            user.isVerified
                                                        }
                                                        className={
                                                            user.isVerified
                                                                ? "bg-green-50 text-green-800 cursor-not-allowed"
                                                                : "text-green-600 focus:text-green-600 cursor-pointer"
                                                        }
                                                    >
                                                        {actionLoading.verifying &&
                                                        actionLoading.userId === user._id ? (
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-green-600" />
                                                        ) : (
                                                            <CheckCircle2
                                                                className={`mr-2 h-4 w-4 ${
                                                                    user.isVerified
                                                                        ? "text-green-800"
                                                                        : "text-green-600"
                                                                }`}
                                                            />
                                                        )}
                                                        {actionLoading.verifying &&
                                                        actionLoading.userId === user._id
                                                            ? "Verifying..."
                                                            : user.isVerified
                                                              ? "Already Verified"
                                                              : "Verify User"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRejectUser(user._id)}
                                                        disabled={
                                                            actionLoading.verifying ||
                                                            actionLoading.rejecting ||
                                                            actionLoading.deactivating ||
                                                            actionLoading.activating ||
                                                            user.isVerified
                                                        }
                                                        className={
                                                            user.isVerified
                                                                ? "bg-red-50 text-red-800 cursor-not-allowed"
                                                                : "text-red-600 focus:text-red-600 cursor-pointer"
                                                        }
                                                    >
                                                        {actionLoading.rejecting &&
                                                        actionLoading.userId === user._id ? (
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-red-600" />
                                                        ) : (
                                                            <XCircle
                                                                className={`mr-2 h-4 w-4 ${
                                                                    user.isVerified
                                                                        ? "text-red-800"
                                                                        : "text-red-600"
                                                                }`}
                                                            />
                                                        )}
                                                        {actionLoading.rejecting &&
                                                        actionLoading.userId === user._id
                                                            ? "Rejecting..."
                                                            : user.isVerified
                                                              ? "Cannot Reject"
                                                              : "Reject User"}
                                                    </DropdownMenuItem>
                                                    {user.role !== "admin" &&
                                                        user.role !== "chairman" &&
                                                        user.role !== "secretary" && (
                                                            <>
                                                                {user.isActive ? (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            setDeactivateDialog({
                                                                                isOpen: true,
                                                                                userId: user._id,
                                                                                reason: "",
                                                                            })
                                                                        }
                                                                        disabled={
                                                                            actionLoading.verifying ||
                                                                            actionLoading.rejecting ||
                                                                            actionLoading.deactivating ||
                                                                            actionLoading.activating
                                                                        }
                                                                        className="text-red-600 focus:text-red-600 cursor-pointer border-t"
                                                                    >
                                                                        {actionLoading.deactivating &&
                                                                        actionLoading.userId ===
                                                                            user._id ? (
                                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-red-600" />
                                                                        ) : (
                                                                            <UserX className="mr-2 h-4 w-4 text-red-600" />
                                                                        )}
                                                                        {actionLoading.deactivating &&
                                                                        actionLoading.userId ===
                                                                            user._id
                                                                            ? "Deactivating..."
                                                                            : "Deactivate User"}
                                                                    </DropdownMenuItem>
                                                                ) : (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleActivateUser(
                                                                                user._id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionLoading.verifying ||
                                                                            actionLoading.rejecting ||
                                                                            actionLoading.deactivating ||
                                                                            actionLoading.activating
                                                                        }
                                                                        className="text-green-600 focus:text-green-600 cursor-pointer border-t"
                                                                    >
                                                                        {actionLoading.activating &&
                                                                        actionLoading.userId ===
                                                                            user._id ? (
                                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-green-600" />
                                                                        ) : (
                                                                            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                                                        )}
                                                                        {actionLoading.activating &&
                                                                        actionLoading.userId ===
                                                                            user._id
                                                                            ? "Activating..."
                                                                            : "Activate User"}
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </>
                                                        )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {searchTerm
                                ? `${filteredUsers.length} results found`
                                : `Total Users: ${filteredUsers.length}`}
                        </p>
                        <div className="flex items-center space-x-6 lg:space-x-8">
                            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <AlertDialog
                open={deactivateDialog.isOpen}
                onOpenChange={(isOpen) => setDeactivateDialog({ isOpen, userId: null, reason: "" })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate User Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please provide a reason for deactivating this account. This will be sent
                            to the user via email.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter reason for deactivation..."
                            value={deactivateDialog.reason}
                            onChange={(e) =>
                                setDeactivateDialog({
                                    ...deactivateDialog,
                                    reason: e.target.value,
                                })
                            }
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() =>
                                setDeactivateDialog({ isOpen: false, userId: null, reason: "" })
                            }
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeactivateUser}
                            disabled={!deactivateDialog.reason.trim() || actionLoading.deactivating}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {actionLoading.deactivating ? "Deactivating..." : "Deactivate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
