import DocumentRequestForm from "@/components/forms/DocumentRequestForm.jsx";

export function Requests() {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Request Barangay Document</h1>
            <DocumentRequestForm />
        </div>
    );
}
