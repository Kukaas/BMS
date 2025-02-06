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
// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
import { mockUsers } from "../secretary/mockData";

export function UserManagementDashboard() {
    const [users, setUsers] = useState(mockUsers);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [filters, setFilters] = useState({
        role: "",
        address: "",
        search: "",
    });

    const roles = [...new Set(users.map((user) => user.role))];
    const addresses = [...new Set(users.map((user) => user.address))];

    useEffect(() => {
        let result = users;
        if (filters.role) {
            result = result.filter((user) => user.role === filters.role);
        }
        if (filters.address) {
            result = result.filter((user) => user.address === filters.address);
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

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "Admin":
                return "bg-red-100 text-red-800";
            case "Barangay Official":
                return "bg-blue-100 text-blue-800";
            case "Secretary":
                return "bg-green-100 text-green-800";
            case "Resident":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
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
                                <SelectItem value="all">All Addresses</SelectItem>
                                {addresses.map((address) => (
                                    <SelectItem key={address} value={address}>
                                        {address}
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
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.address}</TableCell>
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
                                                                {selectedUser.role}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Address
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedUser.address}
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
                                                            {selectedUser.dateRegistered}
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
                {/* <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map(
                            (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => paginate(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => paginate(currentPage + 1)}
                                disabled={
                                    currentPage === Math.ceil(filteredUsers.length / usersPerPage)
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}
            </CardContent>
        </Card>
    );
}
