import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
                    <TableHead>Age</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {residents.map((resident) => (
                    <TableRow key={resident.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={resident.profileImage} alt={resident.name} />
                                    <AvatarFallback>
                                        {resident.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{resident.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{resident.age}</TableCell>
                        <TableCell>{resident.address}</TableCell>
                        <TableCell>{resident.contactNumber}</TableCell>
                        <TableCell>
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
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage
                                                    src={resident.profileImage}
                                                    alt={resident.name}
                                                />
                                                <AvatarFallback>
                                                    {resident.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-xl font-semibold">
                                                    {resident.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {resident.occupation}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">Age</p>
                                                <p className="text-sm">{resident.age}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Family Members
                                                </p>
                                                <p className="text-sm">{resident.familyMembers}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Registered</p>
                                                <p className="text-sm">{resident.dateRegistered}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Address</p>
                                            <p className="text-sm">{resident.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Contact Number</p>
                                            <p className="text-sm">{resident.contactNumber}</p>
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
