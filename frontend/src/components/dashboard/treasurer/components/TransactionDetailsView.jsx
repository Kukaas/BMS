import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    FileText,
    User,
    Calendar,
    CreditCard,
    Receipt,
    Download,
    Eye,
    Building2,
    MapPin,
    AlertTriangle,
    Wallet,
    ZoomIn,
    ZoomOut,
    RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";

export function TransactionDetailsView({ transaction }) {
    // Add state for image viewer
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return format(new Date(dateStr), "MMMM dd, yyyy h:mm a");
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "bg-green-500 hover:bg-green-600";
            case "pending":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "failed":
                return "bg-red-500 hover:bg-red-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    const renderField = (icon, label, value, formatter = (v) => v) => {
        const displayValue = value ? formatter(value) : "N/A";
        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <p className="font-medium">{displayValue}</p>
            </div>
        );
    };

    // Add zoom controls
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 8));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.25));
    const resetZoom = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };
    const rotate = () => setRotation((prev) => (prev + 90) % 360);

    // Add drag handlers
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

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add wheel handler for zoom
    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.005;
            setScale((prev) => Math.min(Math.max(0.25, prev + delta), 8));
        }
    };

    // Add download handler
    const handleDownload = () => {
        try {
            if (!transaction.receipt?.url) {
                toast.error("No receipt available for download");
                return;
            }

            const link = document.createElement("a");
            link.href = transaction.receipt.url;
            link.download = transaction.receipt.filename || "receipt.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Receipt downloaded successfully");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download receipt");
        }
    };

    return (
        <div className="space-y-8 py-4">
            {/* Transaction Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Transaction Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    {renderField(
                        <FileText className="h-4 w-4 text-primary" />,
                        "Document Type",
                        transaction.requestedDocument
                    )}
                    {renderField(
                        <User className="h-4 w-4 text-primary" />,
                        "Requested By",
                        transaction.requestedBy
                    )}
                    {renderField(
                        <Calendar className="h-4 w-4 text-primary" />,
                        "Date Requested",
                        transaction.dateRequested,
                        formatDate
                    )}
                    {renderField(
                        <Receipt className="h-4 w-4 text-primary" />,
                        "Amount",
                        transaction.amount,
                        formatAmount
                    )}
                </div>
            </div>

            {/* Document Specific Details */}
            {transaction.requestedDocument === "Business Clearance" &&
                transaction.businessDetails && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Business Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                            {renderField(
                                <Building2 className="h-4 w-4 text-primary" />,
                                "Business Name",
                                transaction.businessDetails.name
                            )}
                            {renderField(
                                <FileText className="h-4 w-4 text-primary" />,
                                "Business Type",
                                transaction.businessDetails.type
                            )}
                            {renderField(
                                <FileText className="h-4 w-4 text-primary" />,
                                "Business Nature",
                                transaction.businessDetails.nature
                            )}
                            {renderField(
                                <MapPin className="h-4 w-4 text-primary" />,
                                "Business Address",
                                transaction.businessDetails.address
                            )}
                        </div>
                    </div>
                )}

            {transaction.requestedDocument === "Blotter Report" && transaction.incidentDetails && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Incident Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {renderField(
                            <AlertTriangle className="h-4 w-4 text-primary" />,
                            "Incident Type",
                            transaction.incidentDetails.type
                        )}
                        {renderField(
                            <MapPin className="h-4 w-4 text-primary" />,
                            "Location",
                            transaction.incidentDetails.location
                        )}
                        {renderField(
                            <Calendar className="h-4 w-4 text-primary" />,
                            "Incident Date",
                            transaction.incidentDetails.date,
                            formatDate
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Description",
                            transaction.incidentDetails.description
                        )}
                    </div>
                </div>
            )}

            {/* Payment Information */}
            {transaction.paymentDetails && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Payment Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {renderField(
                            <Wallet className="h-4 w-4 text-primary" />,
                            "Payment Method",
                            transaction.paymentDetails.method
                        )}
                        {transaction.paymentDetails.referenceNumber &&
                            renderField(
                                <FileText className="h-4 w-4 text-primary" />,
                                "Reference Number",
                                transaction.paymentDetails.referenceNumber
                            )}
                        {renderField(
                            <Calendar className="h-4 w-4 text-primary" />,
                            "Payment Date",
                            transaction.paymentDetails.date,
                            formatDate
                        )}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    Payment Status
                                </span>
                            </div>
                            <Badge
                                className={getPaymentStatusColor(transaction.paymentDetails.status)}
                            >
                                {transaction.paymentDetails.status || "Pending"}
                            </Badge>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Section */}
            {transaction.receipt && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Receipt</h3>
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {transaction.receipt.filename || "Receipt Image"}
                            </span>
                            <div className="flex gap-2">
                                <Dialog
                                    onOpenChange={() => {
                                        resetZoom();
                                        setPosition({ x: 0, y: 0 });
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Receipt Image</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            {/* Zoom controls */}
                                            <div className="flex items-center justify-end gap-2 mb-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={zoomOut}
                                                    disabled={scale <= 0.25}
                                                >
                                                    <ZoomOut className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={resetZoom}
                                                >
                                                    {Math.round(scale * 100)}%
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={zoomIn}
                                                    disabled={scale >= 8}
                                                >
                                                    <ZoomIn className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={rotate}
                                                >
                                                    <RotateCw className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {/* Image container */}
                                            <div
                                                ref={containerRef}
                                                className="relative bg-black/5 rounded-lg overflow-hidden"
                                                style={{
                                                    height: "calc(80vh - 200px)",
                                                    width: "100%",
                                                }}
                                                onWheel={handleWheel}
                                            >
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    style={{
                                                        cursor: isDragging ? "grabbing" : "grab",
                                                        transform: `translate(${position.x}px, ${position.y}px)`,
                                                    }}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseLeave={handleMouseUp}
                                                >
                                                    <img
                                                        src={transaction.receipt.url}
                                                        alt="Receipt"
                                                        className="select-none transition-transform duration-200"
                                                        style={{
                                                            transform: `scale(${scale}) rotate(${rotation}deg)`,
                                                            maxWidth: "none",
                                                            maxHeight: "none",
                                                            transformOrigin: "center center",
                                                            pointerEvents: "none",
                                                        }}
                                                        draggable="false"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm" onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
