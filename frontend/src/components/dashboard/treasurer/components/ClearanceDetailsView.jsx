import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    User,
    Mail,
    Phone,
    Calendar,
    FileText,
    CreditCard,
    Wallet,
    Building2,
    MapPin,
    Eye,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Info,
    Clock,
    Check,
    X,
    AlertCircle,
    Package,
    Receipt,
} from "lucide-react";
import { STATUS_TYPES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function ClearanceDetailsView({ request, handleStatusChange, updating, getAvailableStatuses }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState("personal");

    // Image manipulation functions
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 5));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };
    const rotate = () => setRotation((prev) => (prev + 90) % 360);

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

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case STATUS_TYPES.PENDING:
                return {
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                    icon: <Clock className="w-3.5 h-3.5 mr-1" />,
                };
            case STATUS_TYPES.APPROVED:
                return {
                    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
                    icon: <Check className="w-3.5 h-3.5 mr-1" />,
                };
            case STATUS_TYPES.FOR_PICKUP:
                return {
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: <Package className="w-3.5 h-3.5 mr-1" />,
                };
            case STATUS_TYPES.COMPLETED:
                return {
                    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
                    icon: <Check className="w-3.5 h-3.5 mr-1" />,
                };
            case STATUS_TYPES.REJECTED:
                return {
                    color: "bg-rose-100 text-rose-700 border-rose-200",
                    icon: <X className="w-3.5 h-3.5 mr-1" />,
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    icon: <Info className="w-3.5 h-3.5 mr-1" />,
                };
        }
    };

    const statusBadge = getStatusBadge(request.status);

    return (
        <div className="space-y-6 py-2 max-h-[calc(100vh-180px)] overflow-y-auto">
            {/* Header with status badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}
                    >
                        {statusBadge.icon}
                        {request.status}
                    </span>

                    {request.orNumber && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-100">
                            <Receipt className="w-3.5 h-3.5 mr-1" />
                            OR: {request.orNumber}
                        </span>
                    )}
                </div>

                <span className="text-xs text-gray-500">
                    Request Date: {formatDate(request.requestDate || request.createdAt)}
                </span>
            </div>

            {/* Main content with tabs */}
            <Tabs
                defaultValue="personal"
                className="w-full"
                onValueChange={setActiveTab}
                value={activeTab}
            >
                <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="personal" className="text-sm">
                        <User className="h-4 w-4 mr-1.5" />
                        Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="text-sm">
                        <Wallet className="h-4 w-4 mr-1.5" />
                        Payment Details
                    </TabsTrigger>
                    <TabsTrigger value="receipt" className="text-sm">
                        <Receipt className="h-4 w-4 mr-1.5" />
                        Receipt
                    </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6 focus:outline-none">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Personal Details Card */}
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <User className="h-4 w-4 mr-1.5 text-blue-600" />
                                Personal Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Full Name</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.name || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Age</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.age || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Civil Status</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.civilStatus || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Place of Birth</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.placeOfBirth || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Purpose</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.purpose || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Card */}
                        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 p-5 border border-violet-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-violet-800 mb-4 flex items-center">
                                <Mail className="h-4 w-4 mr-1.5 text-violet-600" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Email</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.email || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Contact Number</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.contactNumber || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Barangay</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.barangay || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Purok</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.purok || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Payment Details Tab */}
                <TabsContent value="payment" className="space-y-6 focus:outline-none">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 border border-emerald-100 shadow-sm"
                    >
                        <h3 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                            <Wallet className="h-4 w-4 mr-1.5 text-emerald-600" />
                            Payment Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500">Payment Method</span>
                                <span className="text-sm font-medium text-right">
                                    {request.paymentMethod || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500">Amount</span>
                                <span className="text-sm font-medium text-right">
                                    ₱{request.amount || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-500">Date of Payment</span>
                                <span className="text-sm font-medium text-right">
                                    {formatDate(request.dateOfPayment)}
                                </span>
                            </div>
                            {request.referenceNumber && (
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-gray-500">Reference Number</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.referenceNumber}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* OR Number Special Section */}
                        {request.orNumber ? (
                            <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                                <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                                    <span className="font-medium text-green-800">
                                        Official Receipt
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">OR Number</span>
                                        <span className="text-sm font-bold text-green-600">
                                            {request.orNumber}
                                        </span>
                                    </div>
                                    {request.treasurerName && (
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-500">
                                                Processed by
                                            </span>
                                            <span className="text-xs text-gray-600">
                                                {request.treasurerName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            request.status === STATUS_TYPES.PENDING && (
                                <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-amber-400 shadow-sm">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                        <span className="font-medium text-amber-800">
                                            OR Number Required
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-amber-600">
                                        An OR number will be assigned when this clearance is
                                        approved.
                                    </p>
                                </div>
                            )
                        )}
                    </motion.div>
                </TabsContent>

                {/* Receipt Tab */}
                <TabsContent value="receipt" className="space-y-6 focus:outline-none">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl bg-white p-5 border shadow-sm"
                    >
                        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                            <Receipt className="h-4 w-4 mr-1.5 text-gray-600" />
                            Payment Receipt
                        </h3>

                        {request.receipt && request.receipt.data ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <p className="text-xs text-gray-500 truncate">
                                        {request.receipt.filename || "receipt.jpg"}
                                    </p>
                                </div>

                                {/* Preview image with enhanced controls */}
                                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 aspect-video flex items-center justify-center">
                                    <img
                                        src={
                                            request.receipt.data.startsWith("data:")
                                                ? request.receipt.data
                                                : `data:${request.receipt.contentType || "image/jpeg"};base64,${request.receipt.data}`
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
                                            <Button variant="outline" size="sm" className="flex-1">
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
                                                                request.receipt.data.startsWith(
                                                                    "data:"
                                                                )
                                                                    ? request.receipt.data
                                                                    : `data:${request.receipt.contentType || "image/jpeg"};base64,${request.receipt.data}`
                                                            }
                                                            alt="Receipt"
                                                            style={{
                                                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                                                                transition: isDragging
                                                                    ? "none"
                                                                    : "transform 0.15s ease",
                                                                transformOrigin: "center center",
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
                                                const imageData = request.receipt.data;
                                                if (!imageData) {
                                                    throw new Error("No receipt data");
                                                }

                                                const imageUrl = imageData.startsWith("data:")
                                                    ? imageData
                                                    : `data:${request.receipt.contentType || "image/jpeg"};base64,${imageData}`;

                                                const link = document.createElement("a");
                                                link.href = imageUrl;
                                                link.download =
                                                    request.receipt.filename || "receipt.jpg";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                toast.success("Receipt downloaded successfully");
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
                className="sticky bottom-0 bg-white bg-opacity-80 backdrop-blur-sm border-t pt-5"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-700">Update Status</h3>
                        <p className="text-xs text-gray-500">
                            As a treasurer, you can{" "}
                            {getAvailableStatuses(request.status).length > 0
                                ? "approve or reject"
                                : "only view"}{" "}
                            this request
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {getAvailableStatuses(request.status).length > 0 ? (
                            getAvailableStatuses(request.status).map((status) => (
                                <Button
                                    key={status}
                                    variant={
                                        status === STATUS_TYPES.APPROVED ? "default" : "outline"
                                    }
                                    size="sm"
                                    disabled={updating}
                                    onClick={() => handleStatusChange(request, status)}
                                    className={
                                        status === STATUS_TYPES.REJECTED
                                            ? "text-destructive border-destructive hover:bg-destructive/10"
                                            : ""
                                    }
                                >
                                    {status === STATUS_TYPES.APPROVED ? (
                                        <Check className="h-4 w-4 mr-1.5" />
                                    ) : (
                                        <X className="h-4 w-4 mr-1.5" />
                                    )}
                                    {status}
                                </Button>
                            ))
                        ) : (
                            <div className="px-3 py-2 rounded bg-gray-50 border border-gray-200">
                                <p className="text-xs text-gray-500 italic">
                                    {request.status === STATUS_TYPES.APPROVED
                                        ? "This request has been approved with OR number. Further status updates will be handled by secretaries."
                                        : request.status === STATUS_TYPES.REJECTED
                                          ? "This request has been rejected. No further action is needed."
                                          : "Status updates for this request are managed by secretaries."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default ClearanceDetailsView;
