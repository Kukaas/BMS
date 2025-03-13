import AddOfficialForm from "@/components/forms/AddOfficialForm";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Badge, Calendar, Eye, Mail, MapPin, Phone, User2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
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

export default function Officials() {
    const { currentUser } = useSelector((state) => state.user);
    const [officials, setOfficials] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOfficial, setSelectedOfficial] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [officialToDelete, setOfficialToDelete] = useState(null);

    const fetchOfficials = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/officials/get-officials/${currentUser.barangay}`);
            if (response.data.success) {
                setOfficials(response.data.officials);
            }
        } catch (error) {
            console.error("Error fetching officials:", error);
            toast.error("Failed to fetch officials");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficials();
    }, []);

    const handleAddSuccess = () => {
        setIsOpen(false);
        fetchOfficials();
    };

    const handleViewDetails = (official) => {
        setSelectedOfficial(official);
        setIsDetailsOpen(true);
    };

    const handleDelete = async (official) => {
        setOfficialToDelete(official);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await api.delete(`/officials/delete-official/${officialToDelete._id}`);
            if (response.data.success) {
                toast.success("Official deleted successfully");
                fetchOfficials();
            }
        } catch (error) {
            console.error("Error deleting official:", error);
            toast.error("Failed to delete official");
        } finally {
            setIsDeleteDialogOpen(false);
            setOfficialToDelete(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "Inactive":
                return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
        }
    };

    const canDeleteOfficial = currentUser?.role === "secretary" || currentUser?.role === "chairman";

    return (
        <Card className="col-span-3 sticky top-4">
            <CardHeader className="bg-white border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl">Barangay Officials</CardTitle>
                        <p className="text-muted-foreground mt-1">
                            Manage and view barangay officials
                        </p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="px-6">
                                <User2 className="mr-2 h-4 w-4" />
                                Add Official
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>Add New Official</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to add a new official.
                                </DialogDescription>
                            </DialogHeader>
                            <AddOfficialForm
                                onComplete={handleAddSuccess}
                                onCancel={() => setIsOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <div className="overflow-auto h-[32rem]">
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-pulse space-y-4">
                                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
                                <div className="h-4 w-48 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6 auto-rows-max">
                            {officials?.length > 0 ? (
                                officials.map((official) => (
                                    <Card
                                        key={official._id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow h-[200px]"
                                    >
                                        <div className="p-3 h-full flex flex-col">
                                            <div className="flex flex-col items-center text-center space-y-2 flex-1">
                                                {official.image ? (
                                                    <div className="h-12 w-12 rounded-full overflow-hidden ring-1 ring-primary/10">
                                                        <img
                                                            src={official.image.data}
                                                            alt={official.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User2 className="h-6 w-6 text-primary/60" />
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <h3 className="font-medium text-sm truncate max-w-[150px]">
                                                        {official.name}
                                                    </h3>
                                                    <div className="flex items-center justify-center space-x-1.5">
                                                        <Badge className="h-3 w-3 text-primary/60" />
                                                        <p className="text-muted-foreground text-xs">
                                                            {official.position}
                                                            {official.position === "Kagawad" &&
                                                                official.purok &&
                                                                ` - Purok ${official.purok}`}
                                                        </p>
                                                    </div>
                                                    <UIBadge
                                                        variant="secondary"
                                                        className={`text-xs px-2 py-0.5 ${getStatusColor(official.status)}`}
                                                    >
                                                        {official.status}
                                                    </UIBadge>
                                                </div>
                                            </div>
                                            <div className="flex justify-center space-x-2 mt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleViewDetails(official)}
                                                >
                                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                    View
                                                </Button>
                                                {canDeleteOfficial && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleDelete(official)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12">
                                    <User2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                                    <p className="mt-4 text-lg font-medium">No officials found</p>
                                    <p className="text-muted-foreground">
                                        Start by adding a new official
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </div>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Official Details</DialogTitle>
                    </DialogHeader>
                    {selectedOfficial && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                {selectedOfficial.image ? (
                                    <div className="h-24 w-24 rounded-full overflow-hidden ring-1 ring-primary/10">
                                        <img
                                            src={selectedOfficial.image.data}
                                            alt={selectedOfficial.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User2 className="h-12 w-12 text-primary/60" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {selectedOfficial.name}
                                    </h3>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <Badge className="h-4 w-4 text-primary/60" />
                                        <p className="text-base text-muted-foreground">
                                            {selectedOfficial.position}
                                        </p>
                                    </div>
                                    <UIBadge
                                        variant="secondary"
                                        className={`mt-2 ${getStatusColor(selectedOfficial.status)}`}
                                    >
                                        {selectedOfficial.status}
                                    </UIBadge>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-primary/60" />
                                        <div>
                                            <p className="text-sm font-medium">Contact Number</p>
                                            <p className="text-muted-foreground">
                                                {selectedOfficial.contactNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-5 w-5 text-primary/60" />
                                        <div>
                                            <p className="text-sm font-medium">Barangay</p>
                                            <p className="text-muted-foreground">
                                                {selectedOfficial.barangay || "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedOfficial.position === "Kagawad" &&
                                        selectedOfficial.purok && (
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="h-5 w-5 text-primary/60" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Purok Assignment
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        Purok {selectedOfficial.purok}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-primary/60" />
                                        <div>
                                            <p className="text-sm font-medium">Added On</p>
                                            <p className="text-muted-foreground">
                                                {selectedOfficial.createdAt
                                                    ? format(
                                                          new Date(selectedOfficial.createdAt),
                                                          "PPP"
                                                      )
                                                    : "Not available"}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedOfficial.email && (
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-5 w-5 text-primary/60" />
                                            <div>
                                                <p className="text-sm font-medium">Email</p>
                                                <p className="text-muted-foreground">
                                                    {selectedOfficial.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {canDeleteOfficial && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleDelete(selectedOfficial)}
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    Delete Official
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will remove {officialToDelete?.name} from the active
                            officials list. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
