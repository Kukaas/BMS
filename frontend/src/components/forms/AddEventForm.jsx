import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';

const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(1, "Location is required"),
});

export default function AddEventForm({ onSubmit, onCancel, isSubmitting }) {
    const { currentUser } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(eventSchema),
    });

    const handleFormSubmit = async (data) => {
        // Format date for MongoDB
        const formattedDate = new Date(data.date);

        await onSubmit({
            ...data,
            date: formattedDate,
            barangay: currentUser.barangay,
            createdBy: currentUser._id,
        });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Provide details about the event"
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" id="date" {...register("date")} />
                    {errors.date && (
                        <p className="text-sm text-red-500">{errors.date.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                        type="time"
                        id="time"
                        {...register("time")}
                    />
                    {errors.time && (
                        <p className="text-sm text-red-500">{errors.time.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} />
                {errors.location && (
                    <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
            </div>
        </form>
    );
}

AddEventForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};