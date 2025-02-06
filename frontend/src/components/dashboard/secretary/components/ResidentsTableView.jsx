import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function ResidentsTableView({ currentResidents, setSelectedResident, selectedResident }) {
    if (!currentResidents.length) {
        return <div className="text-center py-8 text-gray-500">No residents found</div>;
    }

    const getStatusColor = (status) => {
        return status === "Active"
            ? "bg-green-200 text-green-800"
            : status === "Inactive"
              ? "bg-red-200 text-red-800"
              : "bg-gray-200 text-gray-800";
    };

    const getVerificationColor = (isVerified) => {
        return isVerified
            ? "bg-green-200 text-green-800"
            : "bg-yellow-200 text-yellow-800";
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentResidents.map((resident) => (
                        <TableRow key={resident._id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {resident.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{resident.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{resident.email}</TableCell>
                            <TableCell>
                                {new Date(resident.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={getStatusColor(resident.status)}
                                    variant={resident.statusVariant}
                                >
                                    {resident.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={getVerificationColor(resident.isVerified)}
                                    variant={resident.isVerified ? "success" : "warning"}
                                >
                                    {resident.isVerified ? "Verified" : "Pending"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedResident(resident)}
                                        >
                                            View Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Resident Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            {/* Profile Section */}
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-20 w-20">
                                                    <AvatarFallback>
                                                        {resident.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-semibold truncate">
                                                        {resident.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {resident.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Section */}
                                            <div className="grid gap-2">
                                                <p className="text-sm font-medium">
                                                    Account Status
                                                </p>
                                                <Badge variant={resident.statusVariant}>
                                                    {resident.status}
                                                </Badge>
                                            </div>

                                            {/* Dates Section */}
                                            <div className="grid gap-2">
                                                <p className="text-sm font-medium">Joined Date</p>
                                                <p className="text-sm">
                                                    {new Date(
                                                        resident.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="grid gap-2">
                                                <p className="text-sm font-medium">Last Updated</p>
                                                <p className="text-sm">
                                                    {new Date(
                                                        resident.updatedAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Verification Section */}
                                            <div className="grid gap-2">
                                                <p className="text-sm font-medium">
                                                    Verification Status
                                                </p>
                                                <Badge
                                                    variant={
                                                        resident.isVerified ? "success" : "warning"
                                                    }
                                                >
                                                    {resident.isVerified
                                                        ? "Verified"
                                                        : "Pending Verification"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
