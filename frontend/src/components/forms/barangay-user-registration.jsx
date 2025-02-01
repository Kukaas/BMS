// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Components and UI elements
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

// Utilities
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const schema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email("Invalid email address."),
    role: z.string().nonempty("Role is required."),
    barangay: z.string().min(2, {
        message: "Barangay must be selected.",
    }),
});

export function BarangayUserRegistration({ className }) {
    const [loading, setLoading] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            barangay: "",
        },
    });

    const handleRegister = async (values) => {
        console.log(values);
        try {
            const { name, email, role, barangay } = values;

            if (!name || !email || !role || !barangay) {
                toast.error("All fields are required.");
                return;
            }

            setLoading(true);

            let res;
            if (role === "secretary") {
                res = await axios.post("http://localhost:5000/api/admin/create-secretary-account", {
                    name,
                    email,
                    barangay,
                    password: "secretary",
                });
            } else {
                res = await axios.post("http://localhost:5000/api/admin/create-chairman-account", {
                    name,
                    email,
                    barangay,
                    password: "chairman",
                });
            }

            if (res.status === 201) {
                setLoading(false);
                navigate("/sign-in");
                toast.success("User registered successfully.", {
                    description: "Please verify your email to login.",
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setLoading(false);
                toast.error("Email is already taken", {
                    description: "Please try another email.",
                });
            }
            setLoading(false);
        }
    };

    const fetchBarangays = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_GASAN_BARANGAYS_API_URL);
            setBarangays(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBarangays();
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Register Barangay User</CardTitle>
                <CardDescription>
                    Add a new chairman or secretary to the barangay system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className={cn("flex flex-col gap-6", className)}
                        onSubmit={form.handleSubmit(handleRegister)}
                    >
                        <div className="grid gap-2">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fullname</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="John Doe" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="m@example.com" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Role" />
                                                    </SelectTrigger>
                                                    <SelectContent className="w-full">
                                                        <SelectItem value="chairman">
                                                            Chairman
                                                        </SelectItem>
                                                        <SelectItem value="secretary">
                                                            Secretary
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="barangay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Barangay</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value} // Bind the value
                                                    onValueChange={(value) => {
                                                        field.onChange(value); // Update the field value in react-hook-form
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Barangay" />
                                                    </SelectTrigger>
                                                    <SelectContent className="w-full">
                                                        {barangays && barangays.length > 0 ? (
                                                            barangays.map((barangay) => (
                                                                <SelectItem
                                                                    key={barangay.code}
                                                                    value={barangay.name}
                                                                >
                                                                    {barangay.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <p>No barangays available</p>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Registering..." : "Register User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

BarangayUserRegistration.propTypes = {
    className: PropTypes.string,
};
