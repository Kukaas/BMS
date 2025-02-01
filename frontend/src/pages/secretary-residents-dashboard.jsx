import { SecretaryResidentsDashboard } from "@/components/dashboard/secretary/Residents";

export default function SecretaryResidentsDashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Residents Dashboard</h1>
                <SecretaryResidentsDashboard />
            </div>
        </div>
    );
}
