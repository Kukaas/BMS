import { FileText, MapPin, User, Eye, Download, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function IncidentDetailsView({ incident, handleDownload, handleStatusChange, updating }) {
    const downloadEvidence = (file) => {
        const link = document.createElement("a");
        link.href = file.data;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 py-4">
            {/* Category Section */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className="text-lg font-medium">{incident.category}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Sub-category</h3>
                    <p className="text-lg font-medium">{incident.subCategory}</p>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="text-lg">{incident.location}</p>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {incident.description}
                    </p>
                </div>
            </div>

            {/* Reporter Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Reporter Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Name</span>
                        </div>
                        <p className="font-medium">{incident.reporterName}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Contact</span>
                        </div>
                        <p className="font-medium">{incident.reporterContact}</p>
                    </div>
                </div>
            </div>

            {/* Evidence Files Section */}
            {incident?.evidenceFile && (
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
                                            alt={incident.evidenceFile.filename}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadEvidence(incident.evidenceFile)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Section */}
            <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Update Status</h3>
                        <p className="text-sm text-muted-foreground">
                            Change the current status of this incident report
                        </p>
                    </div>
                    <Select
                        onValueChange={(value) => handleStatusChange(incident._id, value)}
                        defaultValue={incident.status}
                        disabled={updating}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
