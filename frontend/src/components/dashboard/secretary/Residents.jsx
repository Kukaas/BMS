"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Grid, List } from "lucide-react";
import { mockResidents } from "./mockData";
import { ResidentsListView } from "./ResidentsListView";

export function SecretaryResidentsDashboard() {
    const [residents, setResidents] = useState(mockResidents);
    const [selectedResident, setSelectedResident] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

    const filteredResidents = residents.filter(
        (resident) =>
            resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resident.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Residents Information</CardTitle>
                        <div className="flex space-x-2">
                            <Button onClick={toggleViewMode}>
                                {viewMode === "grid" ? (
                                    <List className="h-4 w-4" />
                                ) : (
                                    <Grid className="h-4 w-4" />
                                )}
                                <span className="ml-2">
                                    {viewMode === "grid" ? "List View" : "Grid View"}
                                </span>
                            </Button>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" /> Add New Resident
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <Search className="mr-2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or address"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResidents.map((resident) => (
                                <Card
                                    key={resident.id}
                                    className="hover:shadow-lg transition-shadow duration-300"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-16 w-16">
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
                                                <h3 className="text-lg font-semibold">
                                                    {resident.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {resident.occupation}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium">Age:</span>{" "}
                                                {resident.age}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Address:</span>{" "}
                                                {resident.address}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Contact:</span>{" "}
                                                {resident.contactNumber}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <Badge variant="secondary">
                                                Family: {resident.familyMembers}
                                            </Badge>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedResident(resident)
                                                        }
                                                    >
                                                        View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Resident Details</DialogTitle>
                                                    </DialogHeader>
                                                    {selectedResident && (
                                                        <div className="grid gap-4 py-4">
                                                            <div className="flex items-center space-x-4">
                                                                <Avatar className="h-20 w-20">
                                                                    <AvatarImage
                                                                        src={
                                                                            selectedResident.profileImage
                                                                        }
                                                                        alt={selectedResident.name}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {selectedResident.name
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <h3 className="text-xl font-semibold">
                                                                        {selectedResident.name}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        {
                                                                            selectedResident.occupation
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        Age
                                                                    </p>
                                                                    <p className="text-sm">
                                                                        {selectedResident.age}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        Family Members
                                                                    </p>
                                                                    <p className="text-sm">
                                                                        {
                                                                            selectedResident.familyMembers
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        Registered
                                                                    </p>
                                                                    <p className="text-sm">
                                                                        {
                                                                            selectedResident.dateRegistered
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    Address
                                                                </p>
                                                                <p className="text-sm">
                                                                    {selectedResident.address}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    Contact Number
                                                                </p>
                                                                <p className="text-sm">
                                                                    {selectedResident.contactNumber}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <ResidentsListView
                            residents={filteredResidents}
                            setSelectedResident={setSelectedResident}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
