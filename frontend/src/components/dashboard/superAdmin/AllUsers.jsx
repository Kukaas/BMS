import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { MoreHorizontal, UserX, UserCheck, Loader2, CheckCircle2, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserDetailsView } from "./components/UserDetailsView";

export function UserManagementDashboard() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState({
        verifying: false,
        deactivating: false,
        activating: false,
        userId: null,
    });
    const [deactivateDialog, setDeactivateDialog] = useState({
        isOpen: false,
        userId: null,
        reason: "",
    });
    const [activateDialog, setActivateDialog] = useState({
        isOpen: false,
        userId: null,
    });
    const [verifyDialog, setVerifyDialog] = useState({
        isOpen: false,
        userId: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [filters, setFilters] = useState({
        role: "",
        address: "",
        search: "",
    });

    const roles = [...new Set(users.map((user) => user.role))];
    const addresses = [...new Set(users.map((user) => user.barangay))];

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "superAdmin":
                return "bg-red-100 text-red-800 hover:bg-red-200";
            case "secretary":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "chairman":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "user":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const capitalize = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (res.data) {
                setUsers(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerifyUser = async () => {
        if (!verifyDialog.userId) return;

        try {
            setActionLoading({
                ...actionLoading,
                verifying: true,
            });

            console.log("Verifying user:", verifyDialog.userId);

            const res = await axios.patch(
                `http://localhost:5000/api/users/${verifyDialog.userId}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                await fetchUsers();
                toast.success("User verified successfully");
                setVerifyDialog({ isOpen: false, userId: null });
            }
        } catch (error) {
            console.error("Verification error:", error.response || error);
            toast.error(error.response?.data?.message || "Failed to verify user");
        } finally {
            setActionLoading({
                ...actionLoading,
                verifying: false,
            });
        }
    };

    const handleDeactivateUser = async () => {
        if (!deactivateDialog.userId) return;

        try {
            setActionLoading({
                ...actionLoading,
                deactivating: true,
            });

            console.log("Deactivating user:", deactivateDialog.userId);

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
                await fetchUsers(); // Wait for users to be fetched
                toast.success("User deactivated successfully");
                // Only close the dialog after successful update
                setDeactivateDialog({ isOpen: false, userId: null, reason: "" });
            }
        } catch (error) {
            console.error("Deactivation error:", error.response || error);
            toast.error(error.response?.data?.message || "Failed to deactivate user");
        } finally {
            setActionLoading({
                ...actionLoading,
                deactivating: false,
            });
        }
    };

    const handleActivateUser = async () => {
        if (!activateDialog.userId) return;

        try {
            setActionLoading({
                ...actionLoading,
                activating: true,
            });

            console.log("Activating user with ID:", activateDialog.userId);

            const res = await axios.patch(
                `http://localhost:5000/api/users/${activateDialog.userId}/activate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                await fetchUsers(); // Wait for users to be fetched
                toast.success("User activated successfully");
                // Only close the dialog after successful update
                setActivateDialog({ isOpen: false, userId: null });
            }
        } catch (error) {
            console.error("Activation error:", error.response || error);
            toast.error(error.response?.data?.message || "Failed to activate user");
        } finally {
            setActionLoading({
                ...actionLoading,
                activating: false,
            });
        }
    };

    const isActionLoading = () => {
        return actionLoading.verifying || actionLoading.deactivating || actionLoading.activating;
    };

    // Update the filtering logic
    const filteredUsers = users.filter((user) => {
        const matchesSearch = !filters.search
            ? true
            : user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              user.email.toLowerCase().includes(filters.search.toLowerCase());

        const matchesRole =
            !filters.role || filters.role === "all" ? true : user.role === filters.role;

        const matchesAddress =
            !filters.address || filters.address === "all"
                ? true
                : user.barangay === filters.address;

        return matchesSearch && matchesRole && matchesAddress;
    });

    // Update pagination
    const indexOfLastUser = currentPage * pageSize;
    const indexOfFirstUser = indexOfLastUser - pageSize;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
                <CardTitle>User Management</CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, role: value }))
                            }
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="address">Address</Label>
                        <Select
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, address: value }))
                            }
                        >
                            <SelectTrigger id="address">
                                <SelectValue placeholder="Select address" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Barangays</SelectItem>
                                {addresses.map((barangay) => (
                                    <SelectItem key={barangay} value={barangay}>
                                        {barangay}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search by name or email"
                            value={filters.search}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, search: e.target.value }))
                            }
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verification</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.map((user) => (
                                <TableRow
                                    key={user._id}
                                    className={!user.isActive ? "opacity-60" : ""}
                                >
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={getRoleBadgeColor(user.role)}>
                                            {capitalize(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.barangay}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "outline" : "destructive"}>
                                            {user.isActive ? "Active" : "Deactivated"}
                                        </Badge>
                                    </TableCell>
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
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DialogTrigger asChild>
                                                        <DropdownMenuItem
                                                            onClick={() => setSelectedUser(user)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                    </DialogTrigger>

                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setVerifyDialog({
                                                                isOpen: true,
                                                                userId: user._id,
                                                            });
                                                        }}
                                                        disabled={
                                                            actionLoading.verifying ||
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
                                                        <CheckCircle2
                                                            className={`mr-2 h-4 w-4 ${user.isVerified ? "text-green-800" : "text-green-600"}`}
                                                        />
                                                        Verify User
                                                    </DropdownMenuItem>

                                                    {user.role !== "superAdmin" && (
                                                        <>
                                                            {user.isActive ? (
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setDeactivateDialog({
                                                                            isOpen: true,
                                                                            userId: user._id,
                                                                            reason: "",
                                                                        });
                                                                    }}
                                                                    disabled={isActionLoading()}
                                                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                                                >
                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                    Deactivate User
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setActivateDialog({
                                                                            isOpen: true,
                                                                            userId: user._id,
                                                                        });
                                                                    }}
                                                                    disabled={isActionLoading()}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    Activate User
                                                                </DropdownMenuItem>
                                                            )}
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DialogContent className="max-w-[700px]">
                                                {selectedUser && (
                                                    <UserDetailsView user={selectedUser} />
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {Math.ceil(filteredUsers.length / pageSize)}
                    </p>
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
                            disabled={currentPage === Math.ceil(filteredUsers.length / pageSize)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>

            <AlertDialog
                open={deactivateDialog.isOpen}
                onOpenChange={(isOpen) => {
                    if (!actionLoading.deactivating) {
                        setDeactivateDialog({ isOpen, userId: null, reason: "" });
                    }
                }}
            >
                <AlertDialogContent className="max-w-[500px] mx-auto">
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
                                !actionLoading.deactivating &&
                                setDeactivateDialog({ isOpen: false, userId: null, reason: "" })
                            }
                            disabled={actionLoading.deactivating}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                handleDeactivateUser();
                            }}
                            disabled={!deactivateDialog.reason.trim() || actionLoading.deactivating}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {actionLoading.deactivating ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deactivating...
                                </div>
                            ) : (
                                "Deactivate"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={activateDialog.isOpen}
                onOpenChange={(isOpen) => {
                    if (!actionLoading.activating) {
                        setActivateDialog({ isOpen, userId: null });
                    }
                }}
            >
                <AlertDialogContent className="max-w-[500px] mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Activate User Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to activate this user account? The user will be
                            able to access their account again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() =>
                                !actionLoading.activating &&
                                setActivateDialog({ isOpen: false, userId: null })
                            }
                            disabled={actionLoading.activating}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                handleActivateUser();
                            }}
                            disabled={actionLoading.activating}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            {actionLoading.activating ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Activating...
                                </div>
                            ) : (
                                "Activate"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={verifyDialog.isOpen}
                onOpenChange={(isOpen) => {
                    if (!actionLoading.verifying) {
                        setVerifyDialog({ isOpen, userId: null });
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Verify User Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to verify this user? This will grant them access
                            to all verified user features.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() =>
                                !actionLoading.verifying &&
                                setVerifyDialog({ isOpen: false, userId: null })
                            }
                            disabled={actionLoading.verifying}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleVerifyUser();
                            }}
                            disabled={actionLoading.verifying}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            {actionLoading.verifying ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                "Verify"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
