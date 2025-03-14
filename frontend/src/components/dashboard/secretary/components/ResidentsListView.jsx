import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import api from "@/lib/axios";
import { EditResidentForm } from "@/components/forms/EditResidentForm";
import { ResidentDetailsView } from "./ResidentDetailsView";

export function ResidentsListView({ residents, onResidentDeleted, onResidentUpdated }) {
    const [viewDialog, setViewDialog] = useState({ isOpen: false, resident: null });
    const [editDialog, setEditDialog] = useState({ isOpen: false, resident: null });
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, resident: null });
    const { currentUser } = useSelector((state) => state.user);

    const handleDelete = async () => {
        try {
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
            setDeleteDialog({ isOpen: false, resident: null });
        }
    };

    return (
        <div className="rounded-md border">
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
                    {residents.map((resident) => (
                        <TableRow key={resident._id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {`${resident.firstName[0]}${resident.lastName[0]}`}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">
                                        {`${resident.firstName} ${resident.lastName}`}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{resident.age}</TableCell>
                            <TableCell>{resident.purok}</TableCell>
                            <TableCell>
                                {new Date(resident.birthDate).toLocaleDateString()}
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
                onOpenChange={(open) =>
                    setDeleteDialog({ isOpen: open, resident: open ? deleteDialog.resident : null })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resident</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this resident? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteDialog({ isOpen: false, resident: null })}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

ResidentsListView.propTypes = {
    residents: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            middleName: PropTypes.string,
            lastName: PropTypes.string.isRequired,
            age: PropTypes.number.isRequired,
            purok: PropTypes.string.isRequired,
            birthDate: PropTypes.string.isRequired,
            fathersName: PropTypes.string,
            mothersName: PropTypes.string,
            createdAt: PropTypes.string.isRequired,
            updatedAt: PropTypes.string.isRequired,
        })
    ).isRequired,
    onResidentDeleted: PropTypes.func,
    onResidentUpdated: PropTypes.func,
};
