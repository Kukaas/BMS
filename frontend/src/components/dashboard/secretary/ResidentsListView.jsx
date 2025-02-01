import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function ResidentsListView({ residents, setSelectedResident }) {
    return (
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
                {residents.map((resident) => (
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
                            <Badge variant={resident.statusVariant}>
                                {resident.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={resident.isVerified ? "success" : "warning"}>
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
                                            <p className="text-sm font-medium">Account Status</p>
                                            <Badge variant={resident.statusVariant}>
                                                {resident.status}
                                            </Badge>
                                        </div>

                                        {/* Dates Section */}
                                        <div className="grid gap-2">
                                            <p className="text-sm font-medium">Joined Date</p>
                                            <p className="text-sm">
                                                {new Date(resident.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <p className="text-sm font-medium">Last Updated</p>
                                            <p className="text-sm">
                                                {new Date(resident.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Verification Section */}
                                        <div className="grid gap-2">
                                            <p className="text-sm font-medium">Verification Status</p>
                                            <Badge variant={resident.isVerified ? "success" : "warning"}>
                                                {resident.isVerified ? "Verified" : "Pending Verification"}
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
    );
}

ResidentsListView.propTypes = {
    residents: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
            updatedAt: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            statusVariant: PropTypes.string.isRequired,
            isVerified: PropTypes.bool.isRequired,
        })
    ).isRequired,
    setSelectedResident: PropTypes.func.isRequired,
};
