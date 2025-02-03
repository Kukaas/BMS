import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Download, FileText, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Add formatDate utility function
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Add handleDownload function
const handleDownload = (evidenceFile) => {
    try {
        let base64Data;
        if (evidenceFile.data.startsWith("data:")) {
            base64Data = evidenceFile.data.split(",")[1];
        } else {
            base64Data = evidenceFile.data;
        }

        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: evidenceFile.contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = evidenceFile.filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
    }
};

export function IncidentReportGrid({ incidents, getStatusColor }) {
    return (
        <>
            {/* Table view for medium and larger screens */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {incidents.map((incident) => (
                            <TableRow key={incident._id}>
                                <TableCell>{incident.date}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{incident.category}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {incident.subCategory}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>{incident.location}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(incident.status)}>
                                        {incident.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                                            <DialogHeader className="border-b pb-4">
                                                <DialogTitle className="text-2xl font-bold">
                                                    Incident Report Details
                                                </DialogTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    Reported on {formatDate(incident.createdAt)}
                                                </p>
                                            </DialogHeader>

                                            <div className="flex-1 overflow-y-auto py-4">
                                                <div className="space-y-6">
                                                    {/* Incident Information */}
                                                    <div className="bg-muted/50 rounded-lg p-6">
                                                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                            <FileText className="h-5 w-5" />
                                                            Incident Information
                                                        </h3>
                                                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Category
                                                                </p>
                                                                <p>{incident.category}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Sub-category
                                                                </p>
                                                                <p>{incident.subCategory}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Location and Time */}
                                                    <div className="bg-muted/50 rounded-lg p-6">
                                                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                            <MapPin className="h-5 w-5" />
                                                            Location and Time
                                                        </h3>
                                                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Date
                                                                </p>
                                                                <p>{incident.date}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Time
                                                                </p>
                                                                <p>{incident.time}</p>
                                                            </div>
                                                            <div className="space-y-1 md:col-span-2">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Location
                                                                </p>
                                                                <p>{incident.location}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="bg-muted/50 rounded-lg p-6">
                                                        <h3 className="font-semibold mb-4">
                                                            Description
                                                        </h3>
                                                        <p className="text-sm whitespace-pre-wrap">
                                                            {incident.description}
                                                        </p>
                                                    </div>

                                                    {/* Reporter Information */}
                                                    <div className="bg-muted/50 rounded-lg p-6">
                                                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                            <User className="h-5 w-5" />
                                                            Reporter Information
                                                        </h3>
                                                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Name
                                                                </p>
                                                                <p>{incident.reporterName}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Contact
                                                                </p>
                                                                <p>{incident.reporterContact}</p>
                                                            </div>
                                                        </div>
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
                                                                            {
                                                                                incident
                                                                                    .evidenceFile
                                                                                    .filename
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                            >
                                                                                <Eye className="h-4 w-4 mr-2" />
                                                                                Preview
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-w-4xl w-full h-[90vh]">
                                                                            <DialogHeader>
                                                                                <DialogTitle>
                                                                                    Evidence Image
                                                                                </DialogTitle>
                                                                            </DialogHeader>
                                                                            <div className="relative w-full h-full">
                                                                                <img
                                                                                    src={
                                                                                        incident
                                                                                            .evidenceFile
                                                                                            .data
                                                                                    }
                                                                                    alt="Evidence"
                                                                                    className="w-full h-full object-contain"
                                                                                />
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDownload(
                                                                                incident.evidenceFile
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                        Download
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Grid view for small screens */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {incidents.map((incident) => (
                    <Card key={incident._id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold">{incident.category}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {incident.subCategory}
                                    </p>
                                </div>
                                <Badge className={getStatusColor(incident.status)}>
                                    {incident.status}
                                </Badge>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div>
                                    <h4 className="font-medium">Location</h4>
                                    <p className="text-sm">{incident.location}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium">Date & Time</h4>
                                    <p className="text-sm">
                                        {incident.date} at {incident.time}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                                        <DialogHeader className="border-b pb-4">
                                            <DialogTitle className="text-2xl font-bold">
                                                Incident Report Details
                                            </DialogTitle>
                                            <p className="text-sm text-muted-foreground">
                                                Reported on {formatDate(incident.createdAt)}
                                            </p>
                                        </DialogHeader>

                                        <div className="flex-1 overflow-y-auto py-4">
                                            <div className="space-y-6">
                                                {/* Incident Information */}
                                                <div className="bg-muted/50 rounded-lg p-6">
                                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                        <FileText className="h-5 w-5" />
                                                        Incident Information
                                                    </h3>
                                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Category
                                                            </p>
                                                            <p>{incident.category}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Sub-category
                                                            </p>
                                                            <p>{incident.subCategory}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Location and Time */}
                                                <div className="bg-muted/50 rounded-lg p-6">
                                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                        <MapPin className="h-5 w-5" />
                                                        Location and Time
                                                    </h3>
                                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Date
                                                            </p>
                                                            <p>{incident.date}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Time
                                                            </p>
                                                            <p>{incident.time}</p>
                                                        </div>
                                                        <div className="space-y-1 md:col-span-2">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Location
                                                            </p>
                                                            <p>{incident.location}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="bg-muted/50 rounded-lg p-6">
                                                    <h3 className="font-semibold mb-4">
                                                        Description
                                                    </h3>
                                                    <p className="text-sm whitespace-pre-wrap">
                                                        {incident.description}
                                                    </p>
                                                </div>

                                                {/* Reporter Information */}
                                                <div className="bg-muted/50 rounded-lg p-6">
                                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                        <User className="h-5 w-5" />
                                                        Reporter Information
                                                    </h3>
                                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Name
                                                            </p>
                                                            <p>{incident.reporterName}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Contact
                                                            </p>
                                                            <p>{incident.reporterContact}</p>
                                                        </div>
                                                    </div>
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
                                                                        {
                                                                            incident.evidenceFile
                                                                                .filename
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                        >
                                                                            <Eye className="h-4 w-4 mr-2" />
                                                                            Preview
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-4xl w-full h-[90vh]">
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Evidence Image
                                                                            </DialogTitle>
                                                                        </DialogHeader>
                                                                        <div className="relative w-full h-full">
                                                                            <img
                                                                                src={
                                                                                    incident
                                                                                        .evidenceFile
                                                                                        .data
                                                                                }
                                                                                alt="Evidence"
                                                                                className="w-full h-full object-contain"
                                                                            />
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDownload(
                                                                            incident.evidenceFile
                                                                        )
                                                                    }
                                                                >
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
