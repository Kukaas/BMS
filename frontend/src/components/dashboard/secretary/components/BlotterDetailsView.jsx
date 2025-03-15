import { FileText, MapPin, User, Eye, Download, Phone, Clock, Calendar } from "lucide-react";
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

export function BlotterDetailsView({ blotter, handleDownload, handleStatusChange, updating }) {
    const downloadEvidence = (file) => {
        // Create a link element
        const link = document.createElement("a");
        link.href = file.data;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 py-4">
            {/* Incident Details */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Incident Type</h3>
                    <p className="text-lg font-medium">{blotter.incidentType}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p className="text-lg font-medium">{blotter.incidentLocation}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <p className="font-medium">
                                {new Date(blotter.incidentDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <p className="font-medium">{blotter.incidentTime}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Motive</h3>
                    <p className="text-lg font-medium">{blotter.motive || "N/A"}</p>
                </div>
            </div>

            {/* Complainant Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Complainant Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Name</span>
                        </div>
                        <p className="font-medium">{blotter.complainantName}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Contact</span>
                        </div>
                        <p className="font-medium">{blotter.complainantContact}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Address</span>
                        </div>
                        <p className="font-medium">{blotter.complainantAddress}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Personal Details</span>
                        <p className="font-medium">
                            {blotter.complainantAge} years old, {blotter.complainantGender},{" "}
                            {blotter.complainantCivilStatus}
                        </p>
                    </div>
                </div>
            </div>

            {/* Respondent Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Respondent Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Name</span>
                        </div>
                        <p className="font-medium">{blotter.respondentName}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Contact</span>
                        </div>
                        <p className="font-medium">{blotter.respondentContact || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Address</span>
                        </div>
                        <p className="font-medium">{blotter.respondentAddress || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Witnesses */}
            {(blotter.witnessName || blotter.witnessContact) && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Witnesses</h3>
                    <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Name</span>
                            </div>
                            <p className="font-medium">{blotter.witnessName || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Contact</span>
                            </div>
                            <p className="font-medium">{blotter.witnessContact || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Narrative */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Narrative</h3>
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {blotter.narrative}
                    </p>
                </div>
            </div>

            {/* Action Requested */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Action Requested</h3>
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-lg font-medium">{blotter.actionRequested}</p>
                </div>
            </div>

            {/* Evidence Files Section */}
            {blotter?.evidenceFile && (
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
                                        Preview
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl w-full h-[90vh]">
                                    <DialogHeader>
                                        <DialogTitle>Evidence Image</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative w-full h-full">
                                        <img
                                            src={blotter.evidenceFile.data}
                                            alt={blotter.evidenceFile.filename}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadEvidence(blotter.evidenceFile)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Information Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Amount Paid</span>
                        <p className="font-medium">PHP {blotter.amount?.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Payment Method</span>
                        <p className="font-medium">{blotter.paymentMethod}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Date of Payment</span>
                        <p className="font-medium">
                            {new Date(blotter.dateOfPayment).toLocaleDateString()}
                        </p>
                    </div>
                    {blotter.referenceNumber && (
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Reference Number</span>
                            <p className="font-medium">{blotter.referenceNumber}</p>
                        </div>
                    )}
                </div>

                {/* Receipt Preview */}
                {blotter.receipt && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Payment Receipt
                        </h4>
                        <div className="flex gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Receipt
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                        <DialogTitle>Payment Receipt</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative w-full aspect-video">
                                        <img
                                            src={blotter.receipt.data}
                                            alt="Receipt"
                                            className="w-full h-full object-contain rounded-md"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadEvidence(blotter.receipt)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Update Section */}
            <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Update Status</h3>
                        <p className="text-sm text-muted-foreground">
                            Change the current status of this blotter report
                        </p>
                    </div>
                    <Select
                        onValueChange={(value) => handleStatusChange(blotter._id, value)}
                        defaultValue={blotter.status}
                        disabled={updating}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
