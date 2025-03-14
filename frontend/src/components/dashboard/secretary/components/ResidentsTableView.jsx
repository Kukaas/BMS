import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, MapPin, Calendar, MoreHorizontal, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import api from "@/lib/axios";
import { EditResidentForm } from "@/components/forms/EditResidentForm";
import { ResidentDetailsView } from "./ResidentDetailsView";

export function ResidentsTableView({ currentResidents, onResidentDeleted, onResidentUpdated }) {
    const [viewDialog, setViewDialog] = useState({ isOpen: false, resident: null });
    const [editDialog, setEditDialog] = useState({ isOpen: false, resident: null });
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, resident: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    if (!currentResidents.length) {
        return <div className="text-center py-8 text-gray-500">No residents found</div>;
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await api.delete(`/residents/${deleteDialog.resident._id}`);

            if (response.data.success) {
                if (onResidentDeleted) {
                    onResidentDeleted(deleteDialog.resident._id);
                }
                setDeleteDialog({ isOpen: false, resident: null });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete resident");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Purok</TableHead>
                        <TableHead>Birth Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentResidents.map((resident) => (
                        <TableRow key={resident._id}>
                            <TableCell>
                                <span className="font-medium">
                                    {`${resident.firstName} ${resident.lastName}`}
                                </span>
                            </TableCell>
                            <TableCell>{resident.age}</TableCell>
                            <TableCell>{resident.purok}</TableCell>
                            <TableCell>{formatDate(resident.birthDate)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setViewDialog({ isOpen: true, resident });
                                            }}
                                            className="text-blue-600 focus:text-blue-600"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setEditDialog({ isOpen: true, resident });
                                            }}
                                            className="text-yellow-600 focus:text-yellow-600"
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setDeleteDialog({ isOpen: true, resident });
                                            }}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View Details Dialog */}
            <Dialog
                open={viewDialog.isOpen}
                onOpenChange={(open) =>
                    setViewDialog({ isOpen: open, resident: open ? viewDialog.resident : null })
                }
            >
                <DialogContent className="max-w-[600px]">
                    {viewDialog.resident && <ResidentDetailsView resident={viewDialog.resident} />}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            {editDialog.resident && (
                <EditResidentForm
                    resident={editDialog.resident}
                    isOpen={editDialog.isOpen}
                    onClose={() => setEditDialog({ isOpen: false, resident: null })}
                    onSuccess={(updatedResident) => {
                        if (onResidentUpdated) {
                            onResidentUpdated(updatedResident);
                        }
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
                            Are you sure you want to delete this resident? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() =>
                                !isDeleting && setDeleteDialog({ isOpen: false, resident: null })
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
        </div>
    );
}
