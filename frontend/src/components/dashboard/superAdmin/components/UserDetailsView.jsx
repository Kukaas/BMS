import { User, MapPin, Phone, Calendar, Mail, Shield, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function UserDetailsView({ user }) {
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "superAdmin":
                return "bg-red-100 text-red-800 hover:bg-red-200";
            case "secretary":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "chairman":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "user":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const capitalize = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>User Information</DialogTitle>
            </DialogHeader>

            <div className="space-y-8 py-4">
                {/* Basic Information */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                    <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Full Name</span>
                            </div>
                            <p className="font-medium">
                                {`${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`}
                            </p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Email</span>
                            </div>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Role and Status */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Role & Status</h3>
                    <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Role</span>
                            </div>
                            <Badge className={getRoleBadgeColor(user.role)}>
                                {capitalize(user.role)}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                {user.isActive ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    Account Status
                                </span>
                            </div>
                            <Badge variant={user.isActive ? "outline" : "destructive"}>
                                {user.isActive ? "Active" : "Deactivated"}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Verification</span>
                            </div>
                            <Badge
                                variant={user.isVerified ? "default" : "secondary"}
                                className={
                                    user.isVerified
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : ""
                                }
                            >
                                {user.isVerified ? "Verified" : "Pending"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Contact Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                        <div className="space-y-1 col-span-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Barangay</span>
                            </div>
                            <p className="font-medium">{user.barangay || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Purok</span>
                            </div>
                            <p className="font-medium">{user.purok || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    Contact Number
                                </span>
                            </div>
                            <p className="font-medium">{user.contactNumber || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Account Details</h3>
                    <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Created At</span>
                            </div>
                            <p className="font-medium">{formatDate(user.createdAt)}</p>
                        </div>
                        {user.deactivationReason && (
                            <div className="space-y-1 col-span-2">
                                <span className="text-sm text-muted-foreground">
                                    Deactivation Reason
                                </span>
                                <p className="font-medium text-red-600">
                                    {user.deactivationReason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}