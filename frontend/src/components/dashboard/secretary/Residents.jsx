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
import { useSelector } from "react-redux";
import { AddResidentForm } from "@/components/forms/AddResidentForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Calendar, MapPin } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { ResidentDetailsView } from "./components/ResidentDetailsView";
import { EditResidentForm } from "@/components/forms/EditResidentForm";

export function SecretaryResidentsDashboard() {
    const [residents, setResidents] = useState([]);
    const [selectedResident, setSelectedResident] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("list");
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    // Add state for edit and delete dialogs
    const [editDialog, setEditDialog] = useState({ isOpen: false, resident: null });
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, resident: null });
    const [viewDialog, setViewDialog] = useState({ isOpen: false, resident: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    useEffect(() => {
        if (currentUser?.barangay) {
            fetchUsers();
        }
    }, [currentUser]);

    useEffect(() => {
        // Reset to first page when search term changes
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchUsers = async () => {
        try {
            const response = await api.get(`/residents/${currentUser.barangay}`);
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
    const filteredResidents = residents.filter((resident) => {
        const fullName =
            `${resident.firstName} ${resident.middleName} ${resident.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            resident.purok.toLowerCase().includes(searchTerm.toLowerCase())
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
        setViewMode(viewMode === "list" ? "grid" : "list");
    };

    // Pagination handlers
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleAddSuccess = () => {
        fetchUsers();
    };

    const handleResidentDeleted = (deletedId) => {
        setResidents(residents.filter((resident) => resident._id !== deletedId));
        toast.success("Resident deleted successfully");
    };

    const handleResidentUpdated = (updatedResident) => {
        setResidents(
            residents.map((resident) =>
                resident._id === updatedResident._id ? updatedResident : resident
            )
        );
        toast.success("Resident updated successfully");
    };

    // Update handleDelete function
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await api.delete(`/residents/${deleteDialog.resident._id}`);

            if (response.data.success) {
                handleResidentDeleted(deleteDialog.resident._id);
                setDeleteDialog({ isOpen: false, resident: null });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete resident");
        } finally {
            setIsDeleting(false);
        }
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
                <CardTitle className="text-2xl font-bold mb-4">Residents Information</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search residents by name or purok"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Add Resident</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Resident</DialogTitle>
                                </DialogHeader>
                                <AddResidentForm
                                    onSuccess={handleAddSuccess}
                                    onClose={() => setAddDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" onClick={toggleViewMode}>
                            {viewMode === "list" ? (
                                <>
                                    <Grid className="h-4 w-4 mr-2" />
                                    Grid View
                                </>
                            ) : (
                                <>
                                    <List className="h-4 w-4 mr-2" />
                                    List View
                                </>
                            )}
                        </Button>
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
                            onResidentDeleted={handleResidentDeleted}
                            onResidentUpdated={handleResidentUpdated}
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getCurrentPageResidents().map((resident) => (
                                    <Card
                                        key={resident._id}
                                        className="hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                {/* Basic Information */}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-primary mb-4">
                                                        {`${resident.firstName} ${resident.middleName || ""} ${resident.lastName}`}
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-1.5">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Age
                                                            </p>
                                                            <p className="text-base font-medium">
                                                                {resident.age}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Purok
                                                            </p>
                                                            <p className="text-base font-medium">
                                                                {resident.purok}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Additional Details */}
                                                <div className="space-y-1.5">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Birth Date
                                                    </p>
                                                    <p className="text-base font-medium">
                                                        {new Date(
                                                            resident.birthDate
                                                        ).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Family Information */}
                                                {(resident.fathersName || resident.mothersName) && (
                                                    <div className="grid grid-cols-2 gap-6">
                                                        {resident.fathersName && (
                                                            <div className="space-y-1.5">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Father's Name
                                                                </p>
                                                                <p className="text-base font-medium">
                                                                    {resident.fathersName}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {resident.mothersName && (
                                                            <div className="space-y-1.5">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Mother's Name
                                                                </p>
                                                                <p className="text-base font-medium">
                                                                    {resident.mothersName}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="pt-4 flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                Actions
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    setViewDialog({
                                                                        isOpen: true,
                                                                        resident,
                                                                    });
                                                                }}
                                                                className="text-blue-600 focus:text-blue-600"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    setEditDialog({
                                                                        isOpen: true,
                                                                        resident,
                                                                    });
                                                                }}
                                                                className="text-yellow-600 focus:text-yellow-600"
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    setDeleteDialog({
                                                                        isOpen: true,
                                                                        resident,
                                                                    });
                                                                }}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* View Details Dialog */}
                            <Dialog
                                open={viewDialog.isOpen}
                                onOpenChange={(open) =>
                                    setViewDialog({
                                        isOpen: open,
                                        resident: open ? viewDialog.resident : null,
                                    })
                                }
                            >
                                <DialogContent className="max-w-[600px]">
                                    {viewDialog.resident && (
                                        <ResidentDetailsView resident={viewDialog.resident} />
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* Edit Dialog */}
                            {editDialog.resident && (
                                <EditResidentForm
                                    resident={editDialog.resident}
                                    isOpen={editDialog.isOpen}
                                    onClose={() => setEditDialog({ isOpen: false, resident: null })}
                                    onSuccess={(updatedResident) => {
                                        handleResidentUpdated(updatedResident);
                                        setEditDialog({ isOpen: false, resident: null });
                                    }}
                                />
                            )}

                            {/* Delete Confirmation Dialog */}
                            <AlertDialog
                                open={deleteDialog.isOpen}
                                onOpenChange={(open) => {
                                    if (!isDeleting) {
                                        setDeleteDialog({
                                            isOpen: open,
                                            resident: open ? deleteDialog.resident : null,
                                        });
                                    }
                                }}
                            >
                                <AlertDialogContent className="max-w-[400px]">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Resident</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this resident? This
                                            action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel
                                            onClick={() =>
                                                !isDeleting &&
                                                setDeleteDialog({ isOpen: false, resident: null })
                                            }
                                            disabled={isDeleting}
                                        >
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete"
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
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
