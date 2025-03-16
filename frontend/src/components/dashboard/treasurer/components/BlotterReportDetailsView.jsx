import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    FileText,
    CreditCard,
    Receipt,
    Eye,
    Download,
    Check,
    X,
    ZoomIn,
    ZoomOut,
    RotateCw,
    AlertCircle,
    Clock,
    MapPin,
    Loader2,
} from "lucide-react";
import { STATUS_TYPES } from "@/lib/constants";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function BlotterReportDetailsView({ report, handleStatusChange, updating, getAvailableStatuses }) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showORDialog, setShowORDialog] = useState(false);
    const [orNumber, setOrNumber] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Image manipulation functions
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 5));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };
    const rotate = () => setRotation((prev) => (prev + 90) % 360);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleSetUnderInvestigation = async () => {
        if (!orNumber.trim()) {
            toast.error("OR Number is required");
            return;
        }

        await handleStatusChange(report, STATUS_TYPES.UNDER_INVESTIGATION, orNumber.trim());
        setShowORDialog(false);
        setOrNumber("");
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div className="space-y-6 py-2 max-h-[calc(100vh-180px)] overflow-y-auto">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="details">
                        <FileText className="h-4 w-4 mr-1.5" />
                        Report Details
                    </TabsTrigger>
                    <TabsTrigger value="payment">
                        <CreditCard className="h-4 w-4 mr-1.5" />
                        Payment & Receipt
                    </TabsTrigger>
                </TabsList>

                {/* Report Details Tab */}
                <TabsContent value="details">
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Complainant Information */}
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100">
                            <h3 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <User className="h-4 w-4 mr-1.5 text-blue-600" />
                                Complainant Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Name</span>
                                    <span className="text-sm font-medium">
                                        {report.complainantName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Age</span>
                                    <span className="text-sm font-medium">
                                        {report.complainantAge}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Gender</span>
                                    <span className="text-sm font-medium">
                                        {report.complainantGender}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Civil Status</span>
                                    <span className="text-sm font-medium">
                                        {report.complainantCivilStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Contact</span>
                                    <span className="text-sm font-medium">
                                        {report.complainantContact}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Address</span>
                                    <span className="text-sm font-medium text-right">
                                        {report.complainantAddress}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Incident Information */}
                        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 p-5 border border-violet-100">
                            <h3 className="text-sm font-semibold text-violet-800 mb-4 flex items-center">
                                <FileText className="h-4 w-4 mr-1.5 text-violet-600" />
                                Incident Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Date</span>
                                    <span className="text-sm font-medium">
                                        {formatDate(report.incidentDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Time</span>
                                    <span className="text-sm font-medium">
                                        {report.incidentTime}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Location</span>
                                    <span className="text-sm font-medium text-right">
                                        {report.incidentLocation}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Type</span>
                                    <span className="text-sm font-medium">
                                        {report.incidentType}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Action Requested</span>
                                    <span className="text-sm font-medium">
                                        {report.actionRequested}
                                    </span>
                                </div>
                                {report.motive && (
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Motive</span>
                                        <span className="text-sm font-medium text-right">
                                            {report.motive}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Respondent Information */}
                        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-100">
                            <h3 className="text-sm font-semibold text-amber-800 mb-4 flex items-center">
                                <User className="h-4 w-4 mr-1.5 text-amber-600" />
                                Respondent Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Name</span>
                                    <span className="text-sm font-medium">
                                        {report.respondentName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Address</span>
                                    <span className="text-sm font-medium text-right">
                                        {report.respondentAddress || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Contact</span>
                                    <span className="text-sm font-medium">
                                        {report.respondentContact || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Narrative */}
                        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 border border-emerald-100">
                            <h3 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                                <FileText className="h-4 w-4 mr-1.5 text-emerald-600" />
                                Narrative
                            </h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {report.narrative}
                            </p>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Payment Details Tab */}
                <TabsContent value="payment">
                    <motion.div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 border border-emerald-100">
                        <h3 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                            <CreditCard className="h-4 w-4 mr-1.5 text-emerald-600" />
                            Payment Information & Receipt
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Payment Method</span>
                                <span className="text-sm font-medium">{report.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Amount</span>
                                <span className="text-sm font-medium">
                                    ₱{report.amount?.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Date of Payment</span>
                                <span className="text-sm font-medium">
                                    {formatDate(report.dateOfPayment)}
                                </span>
                            </div>
                            {report.referenceNumber && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Reference Number</span>
                                    <span className="text-sm font-medium">
                                        {report.referenceNumber}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* OR Number Section */}
                        {report.orNumber ? (
                            <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-green-500">
                                <div className="flex items-center">
                                    <Receipt className="h-5 w-5 text-green-600 mr-2" />
                                    <span className="font-medium text-green-800">
                                        Official Receipt
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">OR Number</span>
                                        <span className="text-sm font-bold text-green-600">
                                            {report.orNumber}
                                        </span>
                                    </div>
                                    {report.treasurerName && (
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-500">
                                                Processed by
                                            </span>
                                            <span className="text-xs text-gray-600">
                                                {report.treasurerName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            report.status === STATUS_TYPES.PENDING && (
                                <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-amber-400">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                        <span className="font-medium text-amber-800">
                                            OR Number Required
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-amber-600">
                                        An OR number will be assigned when this report is under
                                        investigation.
                                    </p>
                                </div>
                            )
                        )}

                        {/* Receipt Preview */}
                        {report.receipt && report.receipt.data ? (
                            <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-100">
                                <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                                    <Receipt className="h-4 w-4 mr-1.5 text-emerald-600" />
                                    Payment Receipt
                                </h4>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-xs text-gray-500 truncate">
                                            {report.receipt.filename || "receipt.jpg"}
                                        </p>
                                    </div>

                                    {/* Preview image with enhanced controls */}
                                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 aspect-video flex items-center justify-center">
                                        <img
                                            src={
                                                report.receipt.data.startsWith("data:")
                                                    ? report.receipt.data
                                                    : `data:${report.receipt.contentType || "image/jpeg"};base64,${report.receipt.data}`
                                            }
                                            alt="Receipt"
                                            className="max-h-[300px] object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                                            }}
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Full Screen
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl p-1">
                                                <DialogHeader className="px-4 pt-4 pb-0">
                                                    <DialogTitle>Receipt Image</DialogTitle>
                                                </DialogHeader>
                                                <div className="p-6">
                                                    {/* Zoom controls */}
                                                    <div className="flex justify-end items-center gap-2 mb-4">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={zoomOut}
                                                        >
                                                            <ZoomOut className="h-4 w-4" />
                                                        </Button>
                                                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                                                            {Math.round(scale * 100)}%
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={zoomIn}
                                                        >
                                                            <ZoomIn className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={rotate}
                                                        >
                                                            <RotateCw className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={resetZoom}
                                                        >
                                                            <span className="text-xs">Reset</span>
                                                        </Button>
                                                    </div>

                                                    {/* Image container for manipulation */}
                                                    <div
                                                        className="bg-black/5 rounded-lg overflow-hidden h-[60vh]"
                                                        onMouseDown={handleMouseDown}
                                                        onMouseMove={handleMouseMove}
                                                        onMouseUp={handleMouseUp}
                                                        onMouseLeave={handleMouseUp}
                                                    >
                                                        <div
                                                            className="w-full h-full flex items-center justify-center"
                                                            style={{
                                                                cursor: isDragging
                                                                    ? "grabbing"
                                                                    : "grab",
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    report.receipt.data.startsWith(
                                                                        "data:"
                                                                    )
                                                                        ? report.receipt.data
                                                                        : `data:${report.receipt.contentType || "image/jpeg"};base64,${report.receipt.data}`
                                                                }
                                                                alt="Receipt"
                                                                style={{
                                                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                                                                    transition: isDragging
                                                                        ? "none"
                                                                        : "transform 0.15s ease",
                                                                    transformOrigin:
                                                                        "center center",
                                                                    pointerEvents: "none",
                                                                }}
                                                                className="max-h-full select-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => {
                                                try {
                                                    const imageData = report.receipt.data;
                                                    if (!imageData) {
                                                        throw new Error("No receipt data");
                                                    }

                                                    const imageUrl = imageData.startsWith("data:")
                                                        ? imageData
                                                        : `data:${report.receipt.contentType || "image/jpeg"};base64,${imageData}`;

                                                    const link = document.createElement("a");
                                                    link.href = imageUrl;
                                                    link.download =
                                                        report.receipt.filename || "receipt.jpg";
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                    toast.success(
                                                        "Receipt downloaded successfully"
                                                    );
                                                } catch (error) {
                                                    console.error("Download error:", error);
                                                    toast.error("Failed to download receipt");
                                                }
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <Receipt className="h-10 w-10 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No receipt image available</p>
                            </div>
                        )}
                    </motion.div>
                </TabsContent>
            </Tabs>

            {/* Action Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="sticky bottom-0 bg-white bg-opacity-80 backdrop-blur-sm border-t pt-5 z-50"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-700">Update Status</h3>
                        <p className="text-xs text-gray-500">
                            As a treasurer, you can{" "}
                            {getAvailableStatuses(report.status).length > 0
                                ? "set this report under investigation"
                                : "only view"}{" "}
                            this report
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {getAvailableStatuses(report.status).map((status) => (
                            <Button
                                key={status}
                                variant="default"
                                size="sm"
                                disabled={updating}
                                onClick={() => setShowORDialog(true)}
                            >
                                <Check className="h-4 w-4 mr-1.5" />
                                Set Under Investigation
                            </Button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* OR Number Dialog */}
            <Dialog open={showORDialog} onOpenChange={setShowORDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Provide OR Number</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="orNumber">Official Receipt Number</Label>
                            <Input
                                id="orNumber"
                                placeholder="Enter OR Number"
                                value={orNumber}
                                onChange={(e) => setOrNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowORDialog(false);
                                setOrNumber("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetUnderInvestigation}
                            disabled={updating || !orNumber.trim()}
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Approve with OR"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default BlotterReportDetailsView;
