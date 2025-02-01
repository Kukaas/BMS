import BarangayClearance from "../models/barangay.clearance.model.js";
import BarangayIndigency from "../models/barangay.indigency.model.js";
import BusinessClearance from "../models/business.clearance.model.js";
import Cedula from "../models/cedula.model.js";

// Get all document requests for a barangay
export const getAllDocumentRequests = async (req, res, next) => {
    try {
        // Add authentication verification logging
        console.log("Request headers:", req.headers);
        console.log("Authenticated user:", req.user);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { barangay } = req.user;

        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "User barangay not found"
            });
        }

        console.log("Fetching requests for barangay:", barangay);

        // Fetch requests from all document types
        const [clearances, indigency, business, cedulas] = await Promise.all([
            BarangayClearance.find({ barangay }).sort({ createdAt: -1 }),
            BarangayIndigency.find({ barangay }).sort({ createdAt: -1 }),
            BusinessClearance.find({ barangay }).sort({ createdAt: -1 }),
            Cedula.find({ barangay }).sort({ createdAt: -1 }),
        ]);

        console.log("Found documents:", {
            clearances: clearances.length,
            indigency: indigency.length,
            business: business.length,
            cedulas: cedulas.length,
        });

        // Transform and combine all requests
        const allRequests = [
            ...clearances.map((doc) => ({
                id: doc._id,
                type: "Barangay Clearance",
                requestDate: doc.createdAt || new Date(),
                residentName: doc.name,
                status: doc.status || "Pending",
                purpose: doc.purpose,
                email: doc.email,
                contactNumber: doc.contactNumber,
            })),
            ...indigency.map((doc) => ({
                id: doc._id,
                type: "Certificate of Indigency",
                requestDate: doc.createdAt || new Date(),
                residentName: doc.name,
                status: doc.status || "Pending",
                purpose: doc.purpose,
                contactNumber: doc.contactNumber,
            })),
            ...business.map((doc) => ({
                id: doc._id,
                type: "Business Clearance",
                requestDate: doc.createdAt || new Date(),
                residentName: doc.ownerName,
                status: doc.status || "Pending",
                purpose: "Business Permit",
                businessName: doc.businessName,
                businessType: doc.businessType,
                businessNature: doc.businessNature,
                ownerAddress: doc.ownerAddress,
                contactNumber: doc.contactNumber,
                email: doc.email,
            })),
            ...cedulas.map((doc) => ({
                id: doc._id,
                type: "Cedula",
                requestDate: doc.createdAt || new Date(),
                residentName: doc.name,
                status: doc.status || "Pending",
                purpose: "Community Tax Certificate",
                dateOfBirth: doc.dateOfBirth,
                placeOfBirth: doc.placeOfBirth,
                civilStatus: doc.civilStatus,
                occupation: doc.occupation,
                tax: doc.tax,
            })),
        ];

        // Sort all requests by date
        const sortedRequests = allRequests.sort(
            (a, b) => new Date(b.requestDate) - new Date(a.requestDate)
        );

        console.log("Sending response with", sortedRequests.length, "total requests");

        res.status(200).json({
            success: true,
            data: sortedRequests,
        });
    } catch (error) {
        console.error("Error in getAllDocumentRequests:", error);
        next(error);
    }
};

// Update document status
export const updateDocumentStatus = async (req, res, next) => {
    try {
        const { id, type } = req.params;
        const { status } = req.body;
        const { barangay } = req.user;

        let updatedDocument;

        switch (type.toLowerCase()) {
            case "barangay-clearance":
                updatedDocument = await BarangayClearance.findOneAndUpdate(
                    { _id: id },
                    { status: status },
                    { new: true }
                );
                break;

            case "certificate-of-indigency":
                updatedDocument = await BarangayIndigency.findOneAndUpdate(
                    { _id: id },
                    {
                        status: status,
                        isVerified: status === "Approved", // Keep backward compatibility
                    },
                    { new: true }
                );
                break;

            case "business-clearance":
                updatedDocument = await BusinessClearance.findOneAndUpdate(
                    { _id: id },
                    { status: status },
                    { new: true }
                );
                break;

            case "cedula":
                updatedDocument = await Cedula.findOneAndUpdate(
                    { _id: id },
                    { status: status },
                    { new: true }
                );
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: `Invalid document type: ${type}`,
                });
        }

        if (!updatedDocument) {
            return res.status(404).json({
                success: false,
                message: "Document request not found",
            });
        }

        // Add this console.log to debug
        console.log("Updated document:", {
            type,
            id,
            status,
            updatedDocument,
        });

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: {
                id: updatedDocument._id,
                type: type
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                requestDate: updatedDocument.createdAt,
                residentName: updatedDocument.name || updatedDocument.ownerName,
                status: status, // Use the new status directly
                purpose: updatedDocument.purpose,
                // Include other fields based on document type
                ...(type.toLowerCase() === "certificate-of-indigency" && {
                    contactNumber: updatedDocument.contactNumber,
                }),
            },
        });
    } catch (error) {
        console.error("Error updating status:", error);
        next(error);
    }
};
