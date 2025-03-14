import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User,
    Mail,
    Phone,
    Calendar,
    FileText,
    CreditCard,
    Wallet,
    Building2,
    Eye,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCw,
    MapPin,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";

export function DocumentDetailsView({
    request,
    handleStatusChange,
    updating,
    getAvailableStatuses,
}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

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

    // Add wheel handler for zoom with finer control
    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.005;
            setScale((prev) => Math.min(Math.max(0.25, prev + delta), 8));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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

    return (
        <div className="space-y-8 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Combined Basic & Personal Information for Business Clearance */}
            {request.type === "Business Clearance" ? (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {renderField(
                            <User className="h-4 w-4 text-primary" />,
                            "Owner Name",
                            request.ownerName
                        )}
                        {renderField(
                            <Mail className="h-4 w-4 text-primary" />,
                            "Email",
                            request.email
                        )}
                        {renderField(
                            <Phone className="h-4 w-4 text-primary" />,
                            "Contact Number",
                            request.contactNumber
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Barangay",
                            request.barangay
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Municipality",
                            request.municipality
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Province",
                            request.province
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Owner Address",
                            request.ownerAddress
                        )}
                    </div>
                </div>
            ) : (
                // Original Basic Information section for other document types
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {renderField(
                            <User className="h-4 w-4 text-primary" />,
                            "Name",
                            request.name
                        )}
                        {renderField(
                            <Mail className="h-4 w-4 text-primary" />,
                            "Email",
                            request.email
                        )}
                        {renderField(
                            <Phone className="h-4 w-4 text-primary" />,
                            "Contact",
                            request.contactNumber
                        )}
                    </div>
                </div>
            )}

            {/* Business Information */}
            {request.type === "Business Clearance" && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Business Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {renderField(
                            <Building2 className="h-4 w-4 text-primary" />,
                            "Business Name",
                            request.businessName
                        )}
                        {renderField(
                            <Building2 className="h-4 w-4 text-primary" />,
                            "Business Type",
                            request.businessType
                        )}
                        {renderField(
                            <Building2 className="h-4 w-4 text-primary" />,
                            "Business Nature",
                            request.businessNature
                        )}
                    </div>
                </div>
            )}

            {/* Documents Information */}
            {request.type === "Business Clearance" && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Required Documents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "DTI/SEC Registration",
                            request.dtiSecRegistration
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Mayor's Permit",
                            request.mayorsPermit || "Not provided"
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Lease Contract",
                            request.leaseContract || "Not provided"
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Barangay Clearance",
                            request.barangayClearance
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Fire Safety Certificate",
                            request.fireSafetyCertificate || "Not provided"
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Sanitary Permit",
                            request.sanitaryPermit || "Not provided"
                        )}
                        {renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Valid ID",
                            request.validId
                        )}
                    </div>
                </div>
            )}

            {/* Payment Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    {renderField(
                        <Wallet className="h-4 w-4 text-primary" />,
                        "Payment Method",
                        request.paymentMethod
                    )}
                    {renderField(
                        <Wallet className="h-4 w-4 text-primary" />,
                        "Amount",
                        request.amount,
                        (value) => `₱${value}`
                    )}
                    {request.referenceNumber &&
                        renderField(
                            <FileText className="h-4 w-4 text-primary" />,
                            "Reference Number",
                            request.referenceNumber
                        )}
                    {renderField(
                        <Calendar className="h-4 w-4 text-primary" />,
                        "Date of Payment",
                        request.dateOfPayment,
                        formatDate
                    )}

                    {/* Receipt Section */}
                    <div className="col-span-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Receipt</span>
                        </div>
                        {request.receipt?.data ? (
                            <div className="bg-muted/50 rounded-lg p-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex-1 truncate">
                                        <p className="text-sm text-muted-foreground truncate">
                                            {request.receipt.filename}
                                        </p>
                                    </div>
                                </div>
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
                                                Preview
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
                                                            cursor: isDragging
                                                                ? "grabbing"
                                                                : "grab",
                                                            transform: `translate(${position.x}px, ${position.y}px)`,
                                                        }}
                                                        onMouseDown={handleMouseDown}
                                                        onMouseMove={handleMouseMove}
                                                        onMouseUp={handleMouseUp}
                                                        onMouseLeave={handleMouseUp}
                                                    >
                                                        <img
                                                            src={
                                                                request.receipt.data.startsWith(
                                                                    "data:"
                                                                )
                                                                    ? request.receipt.data
                                                                    : `data:${request.receipt.contentType};base64,${request.receipt.data}`
                                                            }
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            try {
                                                const imageUrl = request.receipt.data.startsWith(
                                                    "data:"
                                                )
                                                    ? request.receipt.data
                                                    : `data:${request.receipt.contentType};base64,${request.receipt.data}`;
                                                const link = document.createElement("a");
                                                link.href = imageUrl;
                                                link.download = request.receipt.filename;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
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
                            <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">No receipt image</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Section */}
            <div className="sticky bottom-0 bg-background border-t pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Update Status</h3>
                        <p className="text-sm text-muted-foreground">
                            Change the current status of this document request
                        </p>
                    </div>
                    <Select
                        onValueChange={(value) => {
                            const requestId = request.id || request._id;
                            if (!requestId) {
                                console.error("Missing request ID:", request);
                                toast.error("Cannot update status: Request ID is missing");
                                return;
                            }
                            handleStatusChange(requestId.toString(), request.type, value);
                        }}
                        defaultValue={request.status}
                        disabled={
                            updating ||
                            request.status === "Completed" ||
                            request.status === "Rejected"
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue>{request.status}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {getAvailableStatuses(request.status).map((status) => (
                                <SelectItem
                                    key={status}
                                    value={status}
                                    className={
                                        status === "Rejected"
                                            ? "text-destructive"
                                            : status === "Completed"
                                              ? "text-primary"
                                              : status === "Approved"
                                                ? "text-green-500"
                                                : status === "For Pickup"
                                                  ? "text-blue-500"
                                                  : ""
                                    }
                                >
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-[800px] w-[95%] p-0 overflow-hidden">
                    <DialogHeader className="p-4">
                        <DialogTitle className="text-center">{selectedImage?.title}</DialogTitle>
                        <p className="text-sm text-muted-foreground text-center">
                            {selectedImage?.filename}
                        </p>
                    </DialogHeader>
                    <div
                        className="relative overflow-auto p-4"
                        style={{ maxHeight: "calc(85vh - 100px)" }}
                    >
                        <div className="flex items-center justify-center min-h-[300px] bg-black/5 rounded-lg p-2">
                            {selectedImage && (
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    className="max-w-full h-auto object-contain rounded-lg"
                                    style={{
                                        maxHeight: "calc(85vh - 140px)",
                                        boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function getDocumentSpecificDetails(request) {
    const baseDetails = [
        {
            label: "Purpose",
            value: request.purpose,
            icon: <FileText className="h-4 w-4 text-primary" />,
        },
    ];

    switch (request.type) {
        case "Barangay Clearance":
            return [
                {
                    label: "Purok",
                    value: request.purok,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Date of Birth",
                    value: new Date(request.dateOfBirth).toLocaleDateString(),
                    icon: <Calendar className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Age",
                    value: request.age,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Sex",
                    value: request.sex,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Place of Birth",
                    value: request.placeOfBirth,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Civil Status",
                    value: request.civilStatus,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Purpose",
                    value: request.purpose,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
            ];

        case "Barangay Indigency":
            return baseDetails;

        case "Business Clearance":
            return [
                {
                    label: "Business Name",
                    value: request.businessName,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Business Type",
                    value: request.businessType,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
                {
                    label: "Business Nature",
                    value: request.businessNature,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                },
            ];

        case "Cedula":
            return [
                // Personal Information
                {
                    label: "Date of Birth",
                    value: request.dateOfBirth,
                    icon: <Calendar className="h-4 w-4 text-primary" />,
                    section: "Personal Information",
                },
                {
                    label: "Place of Birth",
                    value: request.placeOfBirth,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                    section: "Personal Information",
                },
                {
                    label: "Civil Status",
                    value: request.civilStatus,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                    section: "Personal Information",
                },
                // Employment Information
                {
                    label: "Occupation",
                    value: request.occupation,
                    icon: <FileText className="h-4 w-4 text-primary" />,
                    section: "Employment Information",
                },
                {
                    label: "Salary",
                    value: request.salary ? `₱${request.salary.toLocaleString()}` : "N/A",
                    icon: <FileText className="h-4 w-4 text-primary" />,
                    section: "Employment Information",
                },
            ];

        default:
            return baseDetails;
    }
}
