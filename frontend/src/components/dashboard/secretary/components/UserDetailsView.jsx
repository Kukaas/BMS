import {
    User,
    MapPin,
    Phone,
    Calendar,
    Mail,
    Shield,
    CheckCircle2,
    XCircle,
    CreditCard,
    X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle, Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UserDetailsView({ user }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "user":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            case "secretary":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "chairman":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
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

            <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-8 py-4">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Basic Information
                        </h3>
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
                                    <span className="text-sm text-muted-foreground">
                                        Verification
                                    </span>
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

                    {/* Valid ID Images */}
                    {user.role === "user" && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Valid ID Images
                            </h3>
                            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                                {/* Front ID */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">
                                            Front ID
                                        </span>
                                    </div>
                                    {user.validId?.front?.data ? (
                                        <div
                                            className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border cursor-pointer transition-transform hover:scale-[1.02]"
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: `data:${user.validId.front.contentType};base64,${user.validId.front.data}`,
                                                    title: "Front ID",
                                                    filename: user.validId.front.filename,
                                                })
                                            }
                                        >
                                            <img
                                                src={`data:${user.validId.front.contentType};base64,${user.validId.front.data}`}
                                                alt="ID Front"
                                                className="h-full w-full object-contain"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                                                <p className="text-xs text-white truncate">
                                                    {user.validId.front.filename}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                No front ID image
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* Back ID */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">
                                            Back ID
                                        </span>
                                    </div>
                                    {user.validId?.back?.data ? (
                                        <div
                                            className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border cursor-pointer transition-transform hover:scale-[1.02]"
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: `data:${user.validId.back.contentType};base64,${user.validId.back.data}`,
                                                    title: "Back ID",
                                                    filename: user.validId.back.filename,
                                                })
                                            }
                                        >
                                            <img
                                                src={`data:${user.validId.back.contentType};base64,${user.validId.back.data}`}
                                                alt="ID Back"
                                                className="h-full w-full object-contain"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                                                <p className="text-xs text-white truncate">
                                                    {user.validId.back.filename}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                No back ID image
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Details */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Account Details
                        </h3>
                        <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Created At
                                    </span>
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
            </ScrollArea>

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
        </>
    );
}
