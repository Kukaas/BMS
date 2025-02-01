
import { Toaster } from "sonner"
import {BarangayUserRegistration} from "@/components/forms/barangay-user-registration.jsx";

export default function RegisterBarangayUserPage() {
    return (
        <div className="container mx-auto py-10">
            <BarangayUserRegistration className="max-w-md mx-auto" />
            <Toaster />
        </div>
    )
}