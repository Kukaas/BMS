import { useState, useEffect } from "react";
import DocumentRequestForm from "@/components/forms/DocumentRequestForm.jsx";
import { mockRequests } from "./secretary/mockData";

export function Requests() {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requests, setRequests] = useState(mockRequests); // Initialize with mock data

    const fetchRequests = async () => {
        try {
            // For now, we'll just use the mock data
            // When the API is ready, uncomment this:
            // const response = await fetch("/api/document-requests");
            // const data = await response.json();
            // setRequests(data);

            setRequests(mockRequests);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRequestComplete = async () => {
        setShowRequestForm(false);
        await fetchRequests();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">My Document Requests</h1>
                <button
                    onClick={() => setShowRequestForm(true)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Request New Document
                </button>
            </div>

            {/* Show existing requests */}
            <div className="mb-8">
                {requests.length === 0 ? (
                    <p className="text-gray-500 text-center">No document requests yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <div key={request.id} className="border rounded-lg p-4 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>
                                        <h3 className="font-semibold">{request.documentType}</h3>
                                        <p className="text-sm text-gray-600">
                                            Status: {request.status}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Purpose: {request.purpose}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Requested on:{" "}
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${
                                            request.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : request.status === "approved"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Show form in modal or conditional render */}
            {showRequestForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg w-full max-w-2xl my-8">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl sm:text-2xl font-bold">Request New Document</h2>
                            <button
                                onClick={() => setShowRequestForm(false)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                            <DocumentRequestForm onComplete={handleRequestComplete} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
