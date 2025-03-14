import { User, MapPin, Calendar } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ResidentDetailsView({ resident }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Resident Information</DialogTitle>
            </DialogHeader>

            <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-8 py-4">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Full Name</span>
                                </div>
                                <p className="font-medium">
                                    {`${resident.firstName} ${resident.middleName ? resident.middleName + " " : ""}${resident.lastName}`}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Age</span>
                                </div>
                                <p className="font-medium">{resident.age}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Birth Date
                                    </span>
                                </div>
                                <p className="font-medium">{formatDate(resident.birthDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Location Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Barangay</span>
                                </div>
                                <p className="font-medium">{resident.barangay}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Purok</span>
                                </div>
                                <p className="font-medium">{resident.purok}</p>
                            </div>
                        </div>
                    </div>

                    {/* Family Information */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Family Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                            {resident.fathersName && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">
                                            Father's Name
                                        </span>
                                    </div>
                                    <p className="font-medium">{resident.fathersName}</p>
                                </div>
                            )}
                            {resident.mothersName && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">
                                            Mother's Name
                                        </span>
                                    </div>
                                    <p className="font-medium">{resident.mothersName}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Record Details */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Record Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Created At
                                    </span>
                                </div>
                                <p className="font-medium">{formatDate(resident.createdAt)}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Last Updated
                                    </span>
                                </div>
                                <p className="font-medium">{formatDate(resident.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </>
    );
}
