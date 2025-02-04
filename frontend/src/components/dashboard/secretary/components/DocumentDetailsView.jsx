import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Add the getStatusColor function
function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-yellow-500 hover:bg-yellow-600";
        case "processing":
            return "bg-blue-500 hover:bg-blue-600";
        case "approved":
            return "bg-green-500 hover:bg-green-600";
        case "completed":
            return "bg-green-700 hover:bg-green-800";
        case "rejected":
            return "bg-red-500 hover:bg-red-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
}

export function DocumentDetailsView({
    request,
    handleStatusChange,
    updating,
    getAvailableStatuses,
}) {
    return (
        <div className="grid gap-4">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium leading-none">Request Date</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(request.requestDate).toLocaleDateString()}
                            </p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </div>
                </div>
                <div className="grid gap-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">Document Type</p>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                    </div>
                </div>
                {getDocumentDetails(request).map((detail, index) => (
                    <div key={index} className="grid gap-2">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium leading-none">{detail.label}</p>
                            <p className="text-sm text-muted-foreground">{detail.value || "N/A"}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-2">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">Update Status</p>
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
                        <SelectTrigger>
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

function getDocumentDetails(request) {
    switch (request.type) {
        case "Barangay Clearance":
            return [
                { label: "Name", value: request.residentName },
                { label: "Purpose", value: request.purpose },
                { label: "Email", value: request.email },
                { label: "Contact Number", value: request.contactNumber },
            ];
        case "Barangay Indigency":
            return [
                { label: "Name", value: request.residentName },
                { label: "Purpose", value: request.purpose },
                { label: "Contact Number", value: request.contactNumber },
            ];
        case "Business Clearance":
            return [
                { label: "Owner Name", value: request.residentName },
                { label: "Business Name", value: request.businessName },
                { label: "Business Type", value: request.businessType },
                { label: "Business Nature", value: request.businessNature },
                { label: "Owner Address", value: request.ownerAddress },
                { label: "Contact Number", value: request.contactNumber },
                { label: "Email", value: request.email },
            ];
        case "Cedula":
            return [
                { label: "Name", value: request.residentName },
                { label: "Date of Birth", value: request.dateOfBirth },
                { label: "Place of Birth", value: request.placeOfBirth },
                { label: "Civil Status", value: request.civilStatus },
                { label: "Occupation", value: request.occupation },
                { label: "Tax", value: request.tax ? `₱${request.tax.toFixed(2)}` : "N/A" },
            ];
        default:
            return [];
    }
}
