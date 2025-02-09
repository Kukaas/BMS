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
import { Badge, Calendar, Eye, Mail, MapPin, Phone, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Officials() {
    const { currentUser } = useSelector((state) => state.user);
    const [officials, setOfficials] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOfficial, setSelectedOfficial] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
                                        className="overflow-hidden hover:shadow-lg transition-shadow h-[280px]"
                                    >
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="flex flex-col items-center text-center space-y-4 flex-1">
                                                {official.image ? (
                                                    <div className="h-20 w-20 rounded-full overflow-hidden ring-2 ring-primary/10">
                                                        <img
                                                            src={official.image.data}
                                                            alt={official.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User2 className="h-10 w-10 text-primary/60" />
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {official.name}
                                                    </h3>
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Badge className="h-4 w-4 text-primary/60" />
                                                        <p className="text-muted-foreground">
                                                            {official.position}
                                                        </p>
                                                    </div>
                                                    <UIBadge
                                                        variant="secondary"
                                                        className={`mt-1 ${getStatusColor(official.status)}`}
                                                    >
                                                        {official.status}
                                                    </UIBadge>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="w-full mt-4"
                                                onClick={() => handleViewDetails(official)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
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
                        <div className="space-y-8">
                            <div className="flex items-center space-x-6">
                                {selectedOfficial.image ? (
                                    <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary/10">
                                        <img
                                            src={selectedOfficial.image.data}
                                            alt={selectedOfficial.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User2 className="h-16 w-16 text-primary/60" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-semibold">
                                        {selectedOfficial.name}
                                    </h3>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <Badge className="h-5 w-5 text-primary/60" />
                                        <p className="text-lg text-muted-foreground">
                                            {selectedOfficial.position}
                                        </p>
                                    </div>
                                    <UIBadge
                                        variant="secondary"
                                        className={`mt-3 ${getStatusColor(selectedOfficial.status)}`}
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
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
