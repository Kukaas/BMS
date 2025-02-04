import { FileText, MapPin, User, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function BlotterDetailsView({ blotter }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-500 text-white hover:bg-yellow-600";
            case "resolved":
                return "bg-green-500 text-white hover:bg-green-600";
            case "in progress":
                return "bg-blue-500 text-white hover:bg-blue-600";
            case "rejected":
                return "bg-red-500 text-white hover:bg-red-600";
            default:
                return "bg-gray-500 text-white hover:bg-gray-600";
        }
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
            {/* Complainant Information */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Complainant Information
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{blotter.complainantName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Age</p>
                        <p>{blotter.complainantAge}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <p>{blotter.complainantContact}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{blotter.complainantAddress}</p>
                    </div>
                </div>
            </div>

            {/* Respondent Information */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Respondent Information
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{blotter.respondentName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <p>{blotter.respondentContact}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{blotter.respondentAddress}</p>
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
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p>{formatDate(blotter.incidentDate)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                        <p>{blotter.incidentTime}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p>{blotter.incidentLocation}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Type</p>
                        <p>{blotter.incidentType}</p>
                    </div>
                </div>
            </div>

            {/* Narrative */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Narrative
                </h3>
                <p className="text-sm whitespace-pre-wrap">{blotter.narrative}</p>
            </div>

            {/* Evidence Files */}
            {blotter.evidenceFile && (
                <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Evidence Files
                    </h3>
                    <div className="mt-2">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1 truncate">
                                <p className="text-sm text-muted-foreground truncate">
                                    {blotter.evidenceFile.filename}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Image
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                        <DialogTitle>Evidence Image</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative w-full aspect-video">
                                        <img
                                            src={blotter.evidenceFile.data}
                                            alt="Evidence"
                                            className="w-full h-full object-contain rounded-md"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(blotter.evidenceFile)}
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
