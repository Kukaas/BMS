import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import api from "../../lib/axios";
import { useSelector } from "react-redux";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AddOfficialForm({ onComplete, onCancel }) {
    const { currentUser } = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            barangay: currentUser?.barangay || "",
        },
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = {
                    filename: file.name,
                    contentType: file.type,
                    data: reader.result,
                };
                setValue("image", fileData, { shouldValidate: true });
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                toast.error("Failed to read file");
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            if (!currentUser?.barangay) {
                toast.error("Barangay information is missing");
                return;
            }

            const requestBody = {
                name: data.name,
                position: data.position,
                contactNumber: data.contactNumber,
                image: data.image,
                barangay: currentUser.barangay,
                createdBy: currentUser._id,
            };

            const response = await api.post("/officials/add-official", requestBody);

            if (response.data.success) {
                toast.success("Official added successfully!");
                reset();
                if (onComplete) onComplete();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to add official. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader className="sticky top-0 bg-white z-10 border-b">
                        <CardTitle>Add Official</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Select
                                onValueChange={(value) => setValue("position", value)}
                                defaultValue=""
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Chairman">Chairman</SelectItem>
                                    <SelectItem value="SK Chairman">SK Chairman</SelectItem>
                                    <SelectItem value="Kagawad">Kagawad</SelectItem>
                                    <SelectItem value="Secretary">Secretary</SelectItem>
                                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.position && (
                                <p className="text-red-500 text-sm">{errors.position.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <Input
                                id="contactNumber"
                                {...register("contactNumber", {
                                    required: "Contact number is required",
                                })}
                            />
                            {errors.contactNumber && (
                                <p className="text-red-500 text-sm">
                                    {errors.contactNumber.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm">{errors.image.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <div className="sticky bottom-0 bg-white py-4 border-t flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            if (onCancel) onCancel();
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Official"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
