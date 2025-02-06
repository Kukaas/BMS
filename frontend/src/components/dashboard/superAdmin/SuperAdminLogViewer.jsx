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
import { CalendarIcon, Search } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

export function SuperAdminLogViewer() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage] = useState(10);
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

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-1 min-w-[200px]">
                        <Label>Date Range</Label>
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
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="type">Log Type</Label>
                        <Select
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, type: value }))
                            }
                        >
                            <SelectTrigger id="type">
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

                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="user">User</Label>
                        <Input
                            id="user"
                            placeholder="Filter by user"
                            value={filters.user}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, user: e.target.value }))
                            }
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search in action or details"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                                }
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
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
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Log Details</DialogTitle>
                                            </DialogHeader>
                                            {selectedLog && (
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Timestamp
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {format(
                                                                new Date(selectedLog.timestamp),
                                                                "yyyy-MM-dd HH:mm:ss"
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Type</Label>
                                                        <div className="col-span-3">
                                                            <Badge
                                                                className={getTypeColor(
                                                                    selectedLog.type
                                                                )}
                                                            >
                                                                {selectedLog.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">User</Label>
                                                        <div className="col-span-3">
                                                            {selectedLog.userId.name}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Action</Label>
                                                        <div className="col-span-3">
                                                            {selectedLog.action}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Details
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedLog.details}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }).map(
                            (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => paginate(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => paginate(currentPage + 1)}
                                disabled={
                                    currentPage === Math.ceil(filteredLogs.length / logsPerPage)
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}
            </CardContent>
        </Card>
    );
}
