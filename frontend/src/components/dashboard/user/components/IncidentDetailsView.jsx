import { FileText, MapPin, User, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function IncidentDetailsView({ incident }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDownload = (file) => {
        // Create a link element
        const link = document.createElement("a");
        link.href = file.data;
        link.download = file.filename || "evidence";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Reporter Information */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Reporter Information
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{incident.reporterName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <p>{incident.reporterContact}</p>
                    </div>
                </div>
            </div>

            {/* Incident Details */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Incident Details
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                        <p>{incident.category}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Sub-category</p>
                        <p>{incident.subCategory}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p>{formatDate(incident.date)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                        <p>{incident.time}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p>{incident.location}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                </h3>
                <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
            </div>

            {/* Evidence Files */}
            {incident.evidenceFile && (
                <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Evidence Files
                    </h3>
                    <div className="mt-2">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1 truncate">
                                <p className="text-sm text-muted-foreground truncate">
                                    {incident.evidenceFile.filename}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {incident.evidenceFile.contentType?.startsWith("image/") && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Preview
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl w-full h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Evidence Image</DialogTitle>
                                        </DialogHeader>
                                        <div className="relative w-full h-full">
                                            <img
                                                src={incident.evidenceFile.data}
                                                alt="Evidence"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(incident.evidenceFile)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
