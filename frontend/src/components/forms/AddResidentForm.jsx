import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    age: z.coerce
        .number()
        .min(0, "Age must be a positive number")
        .max(150, "Age must be less than 150"),
    purok: z.string().min(1, "Purok is required"),
    birthDate: z.string().min(1, "Birth date is required"),
    fathersName: z.string().optional(),
    mothersName: z.string().optional(),
});

export function AddResidentForm({ onSuccess, onClose }) {
    const { currentUser } = useSelector((state) => state.user);
    const [isCreating, setIsCreating] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            age: "",
            purok: "",
            birthDate: "",
            fathersName: "",
            mothersName: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            setIsCreating(true);
            const response = await api.post(`/residents/${currentUser.barangay}`, {
                ...values,
                barangay: currentUser.barangay,
            });

            if (response.data.success) {
                toast.success("Resident added successfully");
                form.reset();
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                if (onClose) {
                    onClose();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add resident");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter first name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Name (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter middle name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter last name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter age" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="purok"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purok</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter purok" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fathersName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Father's Name (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter father's name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mothersName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mother's Name (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter mother's name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                        {isCreating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding Resident...
                            </>
                        ) : (
                            "Add Resident"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
