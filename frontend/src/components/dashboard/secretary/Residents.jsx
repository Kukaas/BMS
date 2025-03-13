import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { Grid, List, Loader2, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { ResidentsTableView } from "./components/ResidentsTableView";

export function SecretaryResidentsDashboard() {
    const [residents, setResidents] = useState([]);
    const [selectedResident, setSelectedResident] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Reset to first page when search term changes
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users/residents");
            if (response.data.success) {
                setResidents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // Filter residents based on search term
    const filteredResidents = residents.filter((user) => {
        const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Calculate pagination
    const totalResidents = filteredResidents.length;
    const totalPagesCount = Math.ceil(totalResidents / pageSize);

    // Get current page residents
    const getCurrentPageResidents = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredResidents.slice(startIndex, endIndex);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

    // Pagination handlers
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading residents...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status) => {
        return status === "Active"
            ? "bg-green-200 text-green-800"
            : status === "Inactive"
              ? "bg-red-200 text-red-800"
              : "bg-gray-200 text-gray-800";
    };

    const getVerificationColor = (isVerified) => {
        return isVerified ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800";
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="mb-2">Residents Information</CardTitle>
                <div className="flex items-center justify-between mt-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex space-x-2">
                            <Button onClick={toggleViewMode}>
                                {viewMode === "grid" ? (
                                    <List className="h-4 w-4" />
                                ) : (
                                    <Grid className="h-4 w-4" />
                                )}
                                <span className="ml-2">
                                    {viewMode === "grid" ? "List View" : "Grid View"}
                                </span>
                            </Button>
                        </div>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[6, 12, 24, 48].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size} per page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {viewMode === "list" ? (
                        <ResidentsTableView
                            currentResidents={getCurrentPageResidents()}
                            setSelectedResident={setSelectedResident}
                            selectedResident={selectedResident}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getCurrentPageResidents().map((resident) => (
                                <Card
                                    key={resident._id}
                                    className="hover:shadow-lg transition-shadow duration-300"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-4 mb-4">
                                            <Avatar className="h-12 w-12 shrink-0">
                                                <AvatarFallback>
                                                    {`${resident.firstName?.[0]}${resident.lastName?.[0]}`}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-semibold truncate">
                                                    {`${resident.firstName} ${resident.middleName} ${resident.lastName}`}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {resident.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Joined:
                                                </span>
                                                <span>
                                                    {new Date(
                                                        resident.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Status:
                                                </span>
                                                <Badge
                                                    className={getStatusColor(resident.status)}
                                                    variant={resident.statusVariant}
                                                >
                                                    {resident.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Verification:
                                                </span>
                                                <Badge
                                                    className={getVerificationColor(
                                                        resident.isVerified
                                                    )}
                                                    variant={
                                                        resident.isVerified ? "success" : "warning"
                                                    }
                                                >
                                                    {resident.isVerified ? "Verified" : "Pending"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedResident(resident)
                                                        }
                                                    >
                                                        View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Resident Details</DialogTitle>
                                                    </DialogHeader>
                                                    {selectedResident && (
                                                        <div className="grid gap-4 py-4">
                                                            <div className="flex items-center space-x-4">
                                                                <Avatar className="h-20 w-20">
                                                                    <AvatarFallback>
                                                                        {`${selectedResident.firstName?.[0]}${selectedResident.lastName?.[0]}`}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="text-xl font-semibold truncate">
                                                                        {`${selectedResident.firstName} ${selectedResident.middleName} ${selectedResident.lastName}`}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground truncate">
                                                                        {selectedResident.email}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid gap-2">
                                                                <p className="text-sm font-medium">
                                                                    Account Status
                                                                </p>
                                                                <Badge
                                                                    variant={
                                                                        selectedResident.statusVariant
                                                                    }
                                                                >
                                                                    {selectedResident.status}
                                                                </Badge>
                                                            </div>

                                                            <div className="grid gap-2">
                                                                <p className="text-sm font-medium">
                                                                    Joined Date
                                                                </p>
                                                                <p className="text-sm">
                                                                    {new Date(
                                                                        selectedResident.createdAt
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>

                                                            <div className="grid gap-2">
                                                                <p className="text-sm font-medium">
                                                                    Last Updated
                                                                </p>
                                                                <p className="text-sm">
                                                                    {new Date(
                                                                        selectedResident.updatedAt
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {Math.min(pageSize, totalResidents)} of {totalResidents}{" "}
                            residents
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
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPagesCount }, (_, i) => i + 1)
                                    .filter((page) => {
                                        return (
                                            page === 1 ||
                                            page === totalPagesCount ||
                                            Math.abs(currentPage - page) <= 1
                                        );
                                    })
                                    .map((page, index, array) => (
                                        <Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="text-muted-foreground">...</span>
                                            )}
                                            <Button
                                                variant={
                                                    currentPage === page ? "default" : "outline"
                                                }
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        </Fragment>
                                    ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPagesCount}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
