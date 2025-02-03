import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { incidentReportSchema } from "./validationSchemas";
import { Loader2, Search, Grid, List, X } from "lucide-react";
import { mockIncidentReports } from "@/components/dashboard/secretary/mockData";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IncidentReportGrid } from "@/components/dashboard/components/IncidentReportGrid";

const incidentCategories = {
    "Crime-Related Incidents": [
        "Theft/Burglary",
        "Assault",
        "Vandalism",
        "Illegal Drugs",
        "Trespassing",
        "Scams/Fraud",
    ],
    "Community Disturbances": [
        "Noise Complaints",
        "Public Intoxication",
        "Disorderly Conduct",
        "Curfew Violations",
    ],
    "Environmental & Health Concerns": [
        "Garbage Dumping",
        "Flooding",
        "Health Hazards",
        "Fire Incidents",
    ],
    "Traffic & Road Issues": ["Illegal Parking", "Reckless Driving", "Accidents"],
    "Missing Persons & Lost Items": ["Missing Person", "Lost & Found"],
    "Domestic & Civil Disputes": ["Family Disputes", "Land/Property Issues", "Neighbor Conflicts"],
    "Animal-Related Incidents": ["Stray Animals", "Animal Bites"],
};

const getStatusColor = (status) => {
    switch (status) {
        case "New":
            return "bg-blue-500 text-white";
        case "In Progress":
            return "bg-yellow-500 text-white";
        case "Resolved":
            return "bg-green-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

const IncidentReportFormContent = ({ onComplete, onCancel }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(incidentReportSchema),
        defaultValues: {
            reporterName: currentUser?.name || "",
            location: currentUser?.barangay || "",
            evidenceFile: null,
        },
    });

    // Update form when user changes
    useEffect(() => {
        if (currentUser) {
            setValue("reporterName", currentUser.name || "");
            setValue("location", currentUser.barangay || "");
        }
    }, [currentUser, setValue]);

    // Use useEffect to handle category changes
    useEffect(() => {
        if (selectedCategory) {
            setValue("category", selectedCategory);
        }
    }, [selectedCategory, setValue]);

    const handleCategoryChange = useCallback((value) => {
        setSelectedCategory(value);
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Processing file:", file.name); // Debug log
            const reader = new FileReader();
            reader.onload = () => {
                console.log("File read successfully"); // Debug log
                const fileData = {
                    filename: file.name,
                    contentType: file.type,
                    data: reader.result,
                };
                console.log("Setting file data:", fileData); // Debug log
                setValue("evidenceFile", fileData, { shouldValidate: true });
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                toast.error("Failed to read file");
            };
            reader.readAsDataURL(file);
        }
    };

    const evidenceFile = watch("evidenceFile");

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            // Include evidenceFile in the request body
            const requestBody = {
                ...data,
                barangay: currentUser.barangay,
                evidenceFile: data.evidenceFile, // Make sure to include the evidence file
            };

            console.log("Submitting data:", requestBody); // Debug log

            const response = await axios.post(
                "http://localhost:5000/api/incident-report",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Incident report submitted successfully!");
                reset();
                setSelectedCategory("");
                onComplete();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to submit incident report. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Incident Category</Label>
                    <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(incidentCategories).map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-category</Label>
                    <Select
                        onValueChange={(value) => setValue("subCategory", value)}
                        disabled={!selectedCategory}
                    >
                        <SelectTrigger id="subCategory">
                            <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedCategory &&
                                incidentCategories[selectedCategory].map((subCategory) => (
                                    <SelectItem key={subCategory} value={subCategory}>
                                        {subCategory}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    {errors.subCategory && (
                        <p className="text-red-500 text-sm">{errors.subCategory.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date of Incident</Label>
                    <Input type="date" id="date" {...register("date")} />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time of Incident</Label>
                    <Input type="time" id="time" {...register("time")} />
                    {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location of Incident</Label>
                    <Input
                        id="location"
                        {...register("location")}
                        placeholder="Enter the incident location"
                        defaultValue={currentUser?.barangay || ""}
                    />
                    {errors.location && (
                        <p className="text-red-500 text-sm">{errors.location.message}</p>
                    )}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description of Incident</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Provide details about the incident"
                        rows={4}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reporterName">Your Name</Label>
                    <Input
                        id="reporterName"
                        {...register("reporterName")}
                        placeholder="Enter your full name"
                        defaultValue={currentUser?.name || ""}
                    />
                    {errors.reporterName && (
                        <p className="text-red-500 text-sm">{errors.reporterName.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reporterContact">Your Contact Information</Label>
                    <Input
                        id="reporterContact"
                        {...register("reporterContact")}
                        placeholder="Enter your phone number or email"
                    />
                    {errors.reporterContact && (
                        <p className="text-red-500 text-sm">{errors.reporterContact.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="evidenceFile">Evidence Image (Optional)</Label>
                    <Input
                        id="evidenceFile"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                    />
                    {evidenceFile && (
                        <div className="relative mt-4">
                            <img
                                src={evidenceFile.data}
                                alt={evidenceFile.filename}
                                className="w-full h-40 object-cover rounded-lg"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                    setValue("evidenceFile", null);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset();
                        setSelectedCategory("");
                        onCancel();
                    }}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
            </div>
        </form>
    );
};

export default function IncidentReportForm() {
    const [showReportForm, setShowReportForm] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");

    // Add filtered incidents logic
    const filteredIncidents = incidents.filter((incident) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            incident.category.toLowerCase().includes(searchLower) ||
            incident.subCategory.toLowerCase().includes(searchLower) ||
            incident.description.toLowerCase().includes(searchLower) ||
            incident.status.toLowerCase().includes(searchLower)
        );
    });

    // Calculate pagination
    const totalIncidents = filteredIncidents.length;
    const totalPages = Math.ceil(totalIncidents / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentIncidents = filteredIncidents.slice(startIndex, endIndex);

    // Fetch user's incident reports
    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:5000/api/incident-report/user/reports",
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            setIncidents(response.data.data);
        } catch (error) {
            console.error("Error fetching incidents:", error);
            toast.error("Failed to load incident reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchIncidents();
        }
    }, [currentUser]);

    const handleReportComplete = () => {
        setShowReportForm(false);
        fetchIncidents(); // Refresh the list after new report
    };

    const handleCancel = () => {
        setShowReportForm(false);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading incidents...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="pt-0 md:pt-8 lg:pt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Incident Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            <div className="relative w-full md:w-[350px] order-2 md:order-1">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 order-1 md:order-2">
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => {
                                        setPageSize(Number(value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[6, 12, 18, 24, 30].map((size) => (
                                            <SelectItem key={size} value={size.toString()}>
                                                {size} per page
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => setShowReportForm(true)}>
                                    Report New Incident
                                </Button>
                            </div>
                        </div>

                        {incidents.length === 0 ? (
                            <p className="text-gray-500 text-center">No incident reports found.</p>
                        ) : (
                            <>
                                {/* Grid view for small screens */}
                                <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2">
                                    {currentIncidents.map((incident) => (
                                        <Card key={incident._id}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {incident.category}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {incident.subCategory}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={getStatusColor(incident.status)}
                                                    >
                                                        {incident.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <div>
                                                        <h4 className="font-medium">Location</h4>
                                                        <p className="text-sm">
                                                            {incident.location}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">Date & Time</h4>
                                                        <p className="text-sm">
                                                            {incident.date} at {incident.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Table view for medium and larger screens */}
                                <div className="hidden md:block rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentIncidents.map((incident) => (
                                                <TableRow key={incident._id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">
                                                                {incident.category}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {incident.subCategory}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{incident.location}</TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p>{incident.date}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {incident.time}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={getStatusColor(
                                                                incident.status
                                                            )}
                                                        >
                                                            {incident.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
                                {searchTerm
                                    ? `${filteredIncidents.length} results found`
                                    : `Total Reports: ${totalIncidents}`}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-6 lg:space-x-8">
                                <div className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Modal */}
            {showReportForm && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg w-full max-w-4xl my-8 shadow-lg overflow-hidden">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Report New Incident</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="hover:bg-gray-100 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            >
                                <span className="text-lg">×</span>
                            </Button>
                        </div>
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
                            <IncidentReportFormContent
                                onComplete={handleReportComplete}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
