import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/lib/axios";
import PropTypes from "prop-types";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function ChangePasswordForm({ onClose, userId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data, e) => {
        e.preventDefault(); // Prevent form submission

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const response = await api.patch(`/users/${userId}/change-password`, {
                oldPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            // Only show success if we get a success response
            if (response.data.success) {
                toast.success("Password changed successfully");
                onClose();
                form.reset();
            }
        } catch (error) {
            // Show all errors as toast messages
            if (error.response?.status === 401) {
                toast.error("Current password does not match");
                // Clear the current password field
                form.setValue('currentPassword', '');
            } else {
                const errorMessage = error.response?.data?.message || "Failed to change password";
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="max-w-[400px]" onPointerDownOutside={(e) => e.preventDefault()}>
            <div className="space-y-1 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-500">
                    Please enter your current password and choose a new one
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Changing...
                                </div>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    );
}

ChangePasswordForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
};