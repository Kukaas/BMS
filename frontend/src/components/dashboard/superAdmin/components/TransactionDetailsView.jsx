import { User, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TransactionDetailsView({ transaction, formatDate, getStatusColor }) {
    return (
        <div className="space-y-2">
            {/* Basic Information */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
                <div className="bg-muted/50 p-6 rounded-lg grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Document Type</h3>
                        <p className="text-lg font-medium">{transaction.requestedDocument}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Approved By</h3>
                        <p className="text-lg font-medium">{transaction.approvedBy || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Dates Section */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Timeline</h2>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Dates</h3>
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <p className="font-medium">
                                        Requested: {formatDate(transaction.dateRequested)}
                                    </p>
                                </div>
                            </div>
                            {transaction.dateApproved && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <p className="font-medium">
                                            Approved: {formatDate(transaction.dateApproved)}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {transaction.dateCompleted && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <p className="font-medium">
                                            Completed: {formatDate(transaction.dateCompleted)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resident Information */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Personal Details</h2>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Resident Information
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Name</span>
                                </div>
                                <p className="font-medium">{transaction.residentName}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Barangay</span>
                                </div>
                                <p className="font-medium">{transaction.barangay}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action History */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Status Updates</h2>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Action History</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Last Action</span>
                                <p className="font-medium capitalize">{transaction.action}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Timestamp</span>
                                <p className="font-medium">{formatDate(transaction.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
