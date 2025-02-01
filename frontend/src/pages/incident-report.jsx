import { IncidentReportsSecretary } from "@/components/dashboard/secretary/IncidentReportsSecretary";

export default function IncidentReportSecretaryPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Incident Reports Dashboard
                </h1>
                <IncidentReportsSecretary />
            </div>
        </div>
    );
}
