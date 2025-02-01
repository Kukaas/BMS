import IncidentReportsForm from "@/components/forms/IncidentReportsForm";

export default function IncidentReportPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Report an Incident
                </h1>
                <IncidentReportsForm />
            </div>
        </div>
    );
}
