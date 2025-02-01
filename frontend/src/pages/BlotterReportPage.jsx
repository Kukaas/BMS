import BlotterReportForm from "@/components/forms/BlotterReportForm";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const BlotterReportPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data, resetForm) => {
        try {
            setIsSubmitting(true);

            // Add timeout to the request
            const timeoutDuration = 30000; // 30 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

            const response = await axios.post("http://localhost:5000/api/blotter/report", data, {
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                timeout: timeoutDuration,
            });

            clearTimeout(timeoutId);

            if (response.status === 201) {
                toast.success("Blotter report submitted successfully!");
                resetForm();
            }
        } catch (error) {
            console.error("Error submitting blotter report:", error);
            const errorMessage =
                error.name === "AbortError"
                    ? "Request timed out. Please try again."
                    : error.response?.data?.message || "Failed to submit report. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    File a Blotter Report
                </h1>
                <BlotterReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
};

export default BlotterReportPage;
