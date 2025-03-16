import { useState } from "react";
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
    Building2,
    User,
    Mail,
    Phone,
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
    Briefcase,
    MapPin,
    DollarSign,
} from "lucide-react";
import { STATUS_TYPES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function BusinessPermitDetailsView({
    request,
    handleStatusChange,
    updating,
    getAvailableStatuses,
}) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    return (
        <div className="space-y-6 py-2 max-h-[calc(100vh-180px)] overflow-y-auto">
            <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="business">
                        <Building2 className="h-4 w-4 mr-1.5" />
                        Business Info
                    </TabsTrigger>
                    <TabsTrigger value="payment">
                        <CreditCard className="h-4 w-4 mr-1.5" />
                        Payment & Receipt
                    </TabsTrigger>
                </TabsList>

                {/* Business Information Tab */}
                <TabsContent value="business">
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Details Card */}
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100">
                            <h3 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <Building2 className="h-4 w-4 mr-1.5 text-blue-600" />
                                Business Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Business Name</span>
                                    <span className="text-sm font-medium">
                                        {request.businessName}
                                    </span>
                                </div>
                                {/* Fixed property names to match the data */}
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Business Type</span>
                                    <span className="text-sm font-medium">
                                        {request.businessType}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">
                                        Nature of Business
                                    </span>
                                    <span className="text-sm font-medium">
                                        {request.businessNature}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Business Location</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.businessLocation}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Operator/Manager</span>
                                    <span className="text-sm font-medium text-right">
                                        {request.operatorManager}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Owner Information Card */}
                        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 p-5 border border-violet-100">
                            <h3 className="text-sm font-semibold text-violet-800 mb-4 flex items-center">
                                <User className="h-4 w-4 mr-1.5 text-violet-600" />
                                Owner Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Owner Name</span>
                                    <span className="text-sm font-medium">{request.ownerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Email</span>
                                    <span className="text-sm font-medium">{request.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Contact Number</span>
                                    <span className="text-sm font-medium">
                                        {request.contactNumber}
                                    </span>
                                </div>
                            </div>
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
                                <span className="text-sm font-medium">{request.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Amount</span>
                                <span className="text-sm font-medium">
                                    {formatCurrency(request.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-gray-500">Date of Payment</span>
                                <span className="text-sm font-medium">
                                    {formatDate(request.dateOfPayment)}
                                </span>
                            </div>
                            {request.referenceNumber && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Reference Number</span>
                                    <span className="text-sm font-medium">
                                        {request.referenceNumber}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* OR Number Section */}
                        {request.orNumber ? (
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
                                <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-amber-400">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                        <span className="font-medium text-amber-800">
                                            OR Number Required
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-amber-600">
                                        An OR number will be assigned when this permit is approved.
                                    </p>
                                </div>
                            )
                        )}

                        {/* Receipt Preview */}
                        {request.receipt && (
                            <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-100">
                                <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                                    <Receipt className="h-4 w-4 mr-1.5 text-emerald-600" />
                                    Payment Receipt
                                </h4>
                                <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden">
                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-white"
                                            onClick={zoomIn}
                                        >
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-white"
                                            onClick={zoomOut}
                                        >
                                            <ZoomOut className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-white"
                                            onClick={rotate}
                                        >
                                            <RotateCw className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-white"
                                            onClick={resetZoom}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-white"
                                            onClick={() => {
                                                const link = document.createElement("a");
                                                link.href = `data:${request.receipt.contentType};base64,${request.receipt.data}`;
                                                link.download = request.receipt.filename;
                                                link.click();
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <motion.div
                                        className="cursor-move"
                                        style={{
                                            scale,
                                            rotate: rotation,
                                            x: position.x,
                                            y: position.y,
                                        }}
                                        drag
                                        dragMomentum={false}
                                        onDragStart={() => setIsDragging(true)}
                                        onDragEnd={() => setIsDragging(false)}
                                        dragConstraints={{
                                            left: -500,
                                            right: 500,
                                            top: -500,
                                            bottom: 500,
                                        }}
                                    >
                                        <img
                                            src={`data:${request.receipt.contentType};base64,${request.receipt.data}`}
                                            alt="Payment Receipt"
                                            className="max-w-full h-auto object-contain"
                                            style={{ maxHeight: "400px" }}
                                        />
                                    </motion.div>
                                </div>
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
                            {getAvailableStatuses(request.status).length > 0
                                ? "approve or reject"
                                : "only view"}{" "}
                            this request
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {getAvailableStatuses(request.status).map((status) => (
                            <Button
                                key={status}
                                variant={status === STATUS_TYPES.APPROVED ? "default" : "outline"}
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
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default BusinessPermitDetailsView;
