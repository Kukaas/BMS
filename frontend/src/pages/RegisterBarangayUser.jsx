import { Toaster } from "sonner";
import { BarangayUserRegistration } from "@/components/forms/BarangayUserRegistration.jsx";

export default function RegisterBarangayUserPage() {
    return (
        <div className="container mx-auto py-10">
            <BarangayUserRegistration className="max-w-md mx-auto" />
            <Toaster />
        </div>
    );
}
