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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { mockUsers } from "../secretary/mockData";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export function UserManagementDashboard() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState(mockUsers);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        role: "",
        address: "",
        search: "",
    });
    const [actionLoading, setActionLoading] = useState({
        verifying: false,
        rejecting: false,
        deactivating: false,
        activating: false,
        userId: null,
    });

    const roles = [...new Set(users.map((user) => user.role))];
    const addresses = [...new Set(users.map((user) => user.barangay))];

    const fetchUsers = async () => {
        const response = await axios.get("http://localhost:5000/api/users", {
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
                Authorization: `Bearer ${currentUser.token}`,
            },
        });
        setUsers(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;
        if (filters.role && filters.role !== "all") {
            result = result.filter((user) => user.role === filters.role);
        }
        if (filters.address && filters.address !== "all") {
            result = result.filter((user) => user.barangay === filters.address);
        }
        if (filters.search) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    user.email.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        setFilteredUsers(result);
        setCurrentPage(1);
    }, [users, filters]);

    const indexOfLastUser = currentPage * pageSize;
    const indexOfFirstUser = indexOfLastUser - pageSize;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

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

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={getRoleBadgeColor(user.role)}>
                                            {capitalize(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.barangay}</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>User Details</DialogTitle>
                                                </DialogHeader>
                                                {selectedUser && (
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Name</Label>
                                                            <div className="col-span-3">
                                                                {selectedUser.name}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Email</Label>
                                                            <div className="col-span-3">
                                                                {selectedUser.email}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Role</Label>
                                                            <div className="col-span-3">
                                                                <Badge
                                                                    className={getRoleBadgeColor(
                                                                        selectedUser.role
                                                                    )}
                                                                >
                                                                    {capitalize(selectedUser.role)}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">
                                                                Barangay
                                                            </Label>
                                                            <div className="col-span-3">
                                                                {selectedUser.barangay}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Phone</Label>
                                                            <div className="col-span-3">
                                                                {selectedUser.phoneNumber}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">
                                                                Registered
                                                            </Label>
                                                            <div className="col-span-3">
                                                                {selectedUser.createdAt}
                                                            </div>
                                                        </div>
                                                    </div>
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
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
