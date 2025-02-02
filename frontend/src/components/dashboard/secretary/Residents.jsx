import { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Loader2 } from "lucide-react";
import { ResidentsListView } from "./ResidentsListView";
import api from "@/lib/axios";
import { toast } from "sonner";

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
        fetchResidents();
    }, []);

    useEffect(() => {
        // Reset to first page when search term changes
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchResidents = async () => {
        try {
            const response = await api.get("/users/residents");
            if (response.data.success) {
                setResidents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching residents:", error);
            toast.error(error.response?.data?.message || "Failed to fetch residents");
        } finally {
            setLoading(false);
        }
    };

    // Filter residents based on search term
    const filteredResidents = residents.filter(
        (resident) =>
            resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resident.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex items-center justify-center h-[500px]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading residents...</p>
                </div>
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Residents Information</CardTitle>
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
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center flex-1 max-w-sm">
                        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-[100px]">
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
                    {/* List/Grid View */}
                    {viewMode === "list" ? (
                        <ResidentsListView
                            residents={getCurrentPageResidents()}
                            setSelectedResident={setSelectedResident}
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
                                                    {resident.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-semibold truncate">
                                                    {resident.name}
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
                                                <Badge variant={resident.statusVariant}>
                                                    {resident.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Verification:
                                                </span>
                                                <Badge
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
                                                                        {selectedResident.name
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="text-xl font-semibold truncate">
                                                                        {selectedResident.name}
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
