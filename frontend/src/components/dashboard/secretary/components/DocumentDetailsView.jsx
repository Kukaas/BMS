import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Calendar, FileText } from "lucide-react";

export function DocumentDetailsView({
    request,
    handleStatusChange,
    updating,
    getAvailableStatuses,
}) {
    return (
        <div className="space-y-8 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Resident Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Name</span>
                        </div>
                        <p className="font-medium">{request.residentName}</p>
                    </div>
                    {request.email && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Email</span>
                            </div>
                            <p className="font-medium">{request.email}</p>
                        </div>
                    )}
                    {request.contactNumber && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Contact</span>
                            </div>
                            <p className="font-medium">{request.contactNumber}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Details with Sections */}
            {request.type === "Barangay Clearance" && (
                <>
                    {/* Personal Information Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Age</span>
                                </div>
                                <p className="font-medium">
                                    {request.age !== undefined ? request.age : "N/A"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Sex</span>
                                </div>
                                <p className="font-medium">{request.sex}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Date of Birth
                                    </span>
                                </div>
                                <p className="font-medium">
                                    {new Date(request.dateOfBirth).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Civil Status
                                    </span>
                                </div>
                                <p className="font-medium">{request.civilStatus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Address Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Purok</span>
                                </div>
                                <p className="font-medium">{request.purok}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Place of Birth
                                    </span>
                                </div>
                                <p className="font-medium">{request.placeOfBirth}</p>
                            </div>
                        </div>
                    </div>

                    {/* Request Details Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Request Details
                        </h3>
                        <div className="grid grid-cols-1 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Purpose</span>
                                </div>
                                <p className="font-medium">{request.purpose}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Other document types remain unchanged */}
            {request.type === "Barangay Indigency" && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Document Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                        {getDocumentSpecificDetails(request).map((detail, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {detail.icon}
                                    <span className="text-sm text-muted-foreground">
                                        {detail.label}
                                    </span>
                                </div>
                                <p className="font-medium">{detail.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                        onValueChange={(value) =>
                            handleStatusChange(request.id, request.type, value)
                        }
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
