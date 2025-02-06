import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, User, FileText, Clock } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

export function SuperAdminLogViewer() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        dateRange: {
            from: undefined,
            to: undefined,
        },
        type: "",
        user: "",
        search: "",
    });

    useEffect(() => {
        // Fetch logs from the backend
        const fetchLogs = async () => {
            try {
                const response = await api.get("/logs");
                setLogs(response.data.data);
                setFilteredLogs(response.data.data);
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        fetchLogs();
    }, []);

    useEffect(() => {
        // Apply filters
        let result = logs;
        if (filters.dateRange.from && filters.dateRange.to) {
            result = result.filter((log) =>
                isWithinInterval(new Date(log.timestamp), {
                    start: filters.dateRange.from,
                    end: filters.dateRange.to,
                })
            );
        }
        if (filters.type && filters.type !== "all") {
            result = result.filter((log) => log.type === filters.type);
        }
        if (filters.user) {
            result = result.filter((log) =>
                log.userId.name.toLowerCase().includes(filters.user.toLowerCase())
            );
        }
        if (filters.search) {
            result = result.filter(
                (log) =>
                    log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
                    log.details.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        setFilteredLogs(result);
        setCurrentPage(1);
    }, [logs, filters]);

    const indexOfLastLog = currentPage * pageSize;
    const indexOfFirstLog = indexOfLastLog - pageSize;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / pageSize);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "User Activity":
                return "bg-blue-200 text-blue-900 hover:bg-blue-300";
            case "Resident Record":
                return "bg-green-200 text-green-900 hover:bg-green-300";
            case "Barangay Clearance":
                return "bg-purple-200 text-purple-900 hover:bg-purple-300";
            case "Barangay Indigency":
                return "bg-purple-200 text-purple-900 hover:bg-purple-300";
            case "Business Clearance":
                return "bg-purple-200 text-purple-900 hover:bg-purple-300";
            case "Cedula":
                return "bg-purple-200 text-purple-900 hover:bg-purple-300";
            case "Incident Report":
                return "bg-red-200 text-red-900 hover:bg-red-300";
            case "Blotter Report":
                return "bg-red-200 text-red-900 hover:bg-red-300";
            case "Audit":
                return "bg-yellow-200 text-yellow-900 hover:bg-yellow-300";
            default:
                return "bg-gray-200 text-gray-900 hover:bg-gray-300";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-4 flex-[2]">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search in action or details"
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, search: e.target.value }))
                                    }
                                    className="pl-8"
                                />
                            </div>
                            <div className="relative flex-1">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="user"
                                    placeholder="Filter by user"
                                    value={filters.user}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, user: e.target.value }))
                                    }
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filters.dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.dateRange?.from ? (
                                            filters.dateRange.to ? (
                                                <>
                                                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                                    {format(filters.dateRange.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(filters.dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={filters.dateRange?.from}
                                        selected={filters.dateRange}
                                        onSelect={(range) =>
                                            setFilters((prev) => ({ ...prev, dateRange: range }))
                                        }
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex-1">
                            <Select
                                onValueChange={(value) =>
                                    setFilters((prev) => ({ ...prev, type: value }))
                                }
                            >
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Select log type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="User Activity">User Activity</SelectItem>
                                    <SelectItem value="Resident Record">Resident Record</SelectItem>
                                    <SelectItem value="Barangay Clearance">
                                        Barangay Clearance
                                    </SelectItem>
                                    <SelectItem value="Barangay Indigency">
                                        Barangay Indigency
                                    </SelectItem>
                                    <SelectItem value="Business Clearance">
                                        Business Clearance
                                    </SelectItem>
                                    <SelectItem value="Cedula">Cedula</SelectItem>
                                    <SelectItem value="Incident Report">Incident Report</SelectItem>
                                    <SelectItem value="Blotter Report">Blotter Report</SelectItem>
                                    <SelectItem value="Audit">Audit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentLogs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell>
                                        {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getTypeColor(log.type)}>{log.type}</Badge>
                                    </TableCell>
                                    <TableCell>{log.userId.name}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setSelectedLog(log)}
                                                >
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[600px]">
                                                <DialogHeader>
                                                    <DialogTitle>Log Details</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-8 py-4">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
                                                            <div className="bg-muted p-4 rounded-lg">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <CalendarIcon className="h-4 w-4 text-primary" />
                                                                        <p className="font-medium">
                                                                            {format(new Date(log.timestamp), "MMM dd, yyyy")}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="h-4 w-4 text-primary" />
                                                                        <p className="font-medium">
                                                                            {format(new Date(log.timestamp), "HH:mm:ss")}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                                                            <div className="bg-muted p-4 rounded-lg">
                                                                <Badge className={getTypeColor(log.type)}>
                                                                    {log.type}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h3 className="text-sm font-medium text-muted-foreground">
                                                            User Information
                                                        </h3>
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-primary" />
                                                                <p className="font-medium">{log.userId.name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-medium text-muted-foreground">Action</h3>
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-primary" />
                                                                <p className="font-medium">{log.action}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                                                        <div className="bg-muted p-4 rounded-lg">
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                                {log.details}
                                                            </p>
                                                        </div>
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
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
