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
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TransactionDetailsView } from "./TransactionDetailsView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function TransactionTableView({
    currentTransactions,
    formatDate,
    getStatusColor,
    setSelectedTransaction,
    searchTerm,
    onSearchChange,
    pageSize,
    onPageSizeChange,
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (!currentTransactions.length) {
        return <div className="text-center py-8 text-gray-500">No transactions found</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Search and Page Size Controls */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-[300px] pl-8"
                            />
                        </div>
                    </div>
                    <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
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

                {/* Table */}
                <div >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Resident Name</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Date Requested</TableHead>
                                <TableHead>Approved By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentTransactions.map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>{transaction.residentName}</TableCell>
                                    <TableCell>{transaction.requestedDocument}</TableCell>
                                    <TableCell>{formatDate(transaction.dateRequested)}</TableCell>
                                    <TableCell>{transaction.approvedBy || "N/A"}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(transaction.status)}>
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedTransaction(transaction)
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl max-h-[95vh]">
                                                <DialogHeader className="border-b pb-4">
                                                    <DialogTitle className="text-2xl font-bold">
                                                        Transaction Report Details
                                                    </DialogTitle>
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Reported on{" "}
                                                            {formatDate(transaction.dateRequested)}
                                                        </p>
                                                        <Badge
                                                            className={`${getStatusColor(transaction.status)} w-[100px] justify-center`}
                                                        >
                                                            {transaction.status}
                                                        </Badge>
                                                    </div>
                                                </DialogHeader>
                                                <ScrollArea className="h-[calc(80vh-8rem)]">
                                                    <div className="p-6">
                                                        <TransactionDetailsView
                                                            transaction={transaction}
                                                            formatDate={formatDate}
                                                            getStatusColor={getStatusColor}
                                                        />
                                                    </div>
                                                </ScrollArea>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage + 1)}
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
