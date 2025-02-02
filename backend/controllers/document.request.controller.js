import BarangayClearance from "../models/barangay.clearance.model.js";
import BarangayIndigency from "../models/barangay.indigency.model.js";
import BusinessClearance from "../models/business.clearance.model.js";
import Cedula from "../models/cedula.model.js";
import User from "../models/user.model.js";
import {
    sendDocumentRequestNotification,
    sendDocumentStatusNotification,
    createNotification
} from "../utils/notifications.js";

// Generic function to update document status
export const updateDocumentStatus = async (Model, requestType, id, status) => {
    const document = await Model.findById(id);
    if (!document) {
        throw new Error(`${requestType} not found`);
    }

    document.isVerified = status === "Approved";
    document.status = status;
    document.dateOfIssuance = new Date();

    await document.save();

    // Map display names to enum values
    const docModelMap = {
        "Business Clearance": "BusinessClearance",
        "Barangay Clearance": "BarangayClearance",
        "Barangay Indigency": "BarangayIndigency",
        "Cedula": "Cedula"
    };

    // Get the correct enum value
    const docModel = docModelMap[requestType];
    if (!docModel) {
        throw new Error(`Invalid document type: ${requestType}`);
    }

    // Create status update notification with secretary info
    const statusNotification = createNotification(
        `${requestType} Status Update`,
        `Your ${requestType.toLowerCase()} request has been ${status.toLowerCase()} by the barangay secretary.`,
        "status_update",
        document._id,
        docModel  // Use the mapped enum value
    );

    // Find user and update their notifications
    if (document.userId) {
        await User.findByIdAndUpdate(document.userId, {
            $push: { notifications: statusNotification },
            $inc: { unreadNotifications: 1 }
        });
    } else if (document.email) {
        const user = await User.findOne({ email: document.email });
        if (user) {
            user.notifications.push(statusNotification);
            user.unreadNotifications += 1;
            await user.save();
        }
    }

    return document;
};

// Get all document requests for a barangay
export const getAllDocumentRequests = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { barangay } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        // Fetch requests from all document types
        const [clearances, indigency, business, cedulas] = await Promise.all([
            BarangayClearance.find({ barangay }).sort({ createdAt: -1 }),
            BarangayIndigency.find({ barangay }).sort({ createdAt: -1 }),
            BusinessClearance.find({ barangay }).sort({ createdAt: -1 }),
            Cedula.find({ barangay }).sort({ createdAt: -1 })
        ]);

        // Transform and combine all requests
        const allRequests = [
            ...clearances.map(doc => ({
                ...doc.toObject(),
                documentType: 'Barangay Clearance'
            })),
            ...indigency.map(doc => ({
                ...doc.toObject(),
                documentType: 'Barangay Indigency'
            })),
            ...business.map(doc => ({
                ...doc.toObject(),
                documentType: 'Business Clearance'
            })),
            ...cedulas.map(doc => ({
                ...doc.toObject(),
                documentType: 'Cedula'
            }))
        ];

        // Sort by creation date
        const sortedRequests = allRequests.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Apply pagination
        const paginatedRequests = sortedRequests.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            data: paginatedRequests,
            pagination: {
                total: allRequests.length,
                page,
                limit,
                totalPages: Math.ceil(allRequests.length / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Generic function to create document request
const createDocumentRequest = async (Model, documentType, data, barangay) => {
    try {
        const document = new Model({
            ...data,
            userId: data.userId,
            email: data.email,
            barangay,
            status: "pending",
            documentType
        });

        await document.save();
        return document;
    } catch (error) {
        console.error(`Error creating ${documentType}:`, error);
        throw error;
    }
};

// Create document request handlers
export const createBarangayClearance = async (req, res, next) => {
    try {
        const document = await createDocumentRequest(
            BarangayClearance,
            "Barangay Clearance",
            req.body,
            req.user.barangay
        );

        res.status(201).json({
            success: true,
            message: "Barangay clearance request created successfully",
            data: document
        });
    } catch (error) {
        console.error("Error creating barangay clearance:", error);
        next(error);
    }
};

export const createBarangayIndigency = async (req, res, next) => {
    try {
        const document = await createDocumentRequest(
            BarangayIndigency,
            "Barangay Indigency",
            req.body,
            req.user.barangay
        );

        res.status(201).json({
            success: true,
            message: "Barangay indigency request created successfully",
            data: document
        });
    } catch (error) {
        console.error("Error creating barangay indigency:", error);
        next(error);
    }
};

// Update status handlers
export const updateBarangayClearanceStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { name: secretaryName } = req.user;

        const document = await BarangayClearance.findById(id);
        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        document.isVerified = status === "Approved";
        document.status = status;
        document.dateOfIssuance = new Date();
        await document.save();

        // Create status update notification
        const statusNotification = createNotification(
            "Barangay Clearance Status Update",
            `Your barangay clearance request has been ${status.toLowerCase()} by ${secretaryName}`,
            "status_update",
            document._id,
            "BarangayClearance"  // Use exact enum value
        );

        // Find user and update their notifications
        if (document.userId) {
            await User.findByIdAndUpdate(document.userId, {
                $push: { notifications: statusNotification },
                $inc: { unreadNotifications: 1 }
            });
        } else if (document.email) {
            const user = await User.findOne({ email: document.email });
            if (user) {
                user.notifications.push(statusNotification);
                user.unreadNotifications += 1;
                await user.save();
            }
        }

        res.status(200).json({
            success: true,
            message: `Document ${status.toLowerCase()} successfully`,
            data: document
        });
    } catch (error) {
        console.error("Error updating barangay clearance status:", error);
        next(error);
    }
};

export const updateBarangayIndigencyStatus = async (req, res, next) => {
    try {
        const document = await updateDocumentStatus(
            BarangayIndigency,
            "Barangay Indigency",
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error("Error updating barangay indigency status:", error);
        next(error);
    }
};

// Add these exports for business clearance and cedula
export const createBusinessClearance = async (req, res, next) => {
    try {
        const document = await createDocumentRequest(
            BusinessClearance,
            "Business Clearance",
            req.body,
            req.user.barangay
        );

        res.status(201).json({
            success: true,
            message: "Business clearance request created successfully",
            data: document
        });
    } catch (error) {
        console.error("Error creating business clearance:", error);
        next(error);
    }
};

export const createCedula = async (req, res, next) => {
    try {
        const document = await createDocumentRequest(
            Cedula,
            "Cedula",
            req.body,
            req.user.barangay
        );

        res.status(201).json({
            success: true,
            message: "Cedula request created successfully",
            data: document
        });
    } catch (error) {
        console.error("Error creating cedula request:", error);
        next(error);
    }
};

export const updateBusinessClearanceStatus = async (req, res, next) => {
    try {
        const document = await updateDocumentStatus(
            BusinessClearance,
            "Business Clearance",
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error("Error updating business clearance status:", error);
        next(error);
    }
};

export const updateCedulaStatus = async (req, res, next) => {
    try {
        const document = await updateDocumentStatus(
            Cedula,
            "Cedula",
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error("Error updating cedula status:", error);
        next(error);
    }
};

// Update getUserDocumentRequests function
export const getUserDocumentRequests = async (req, res, next) => {
    try {
        // Extract user info from the authenticated request
        const userId = req.user.id;  // Get the user ID
        const userEmail = req.user.email;
        const { barangay } = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Create base query with both userId and email
        const baseQuery = {
            barangay,
            $or: [
                { userId: userId },
                { email: userEmail }
            ]
        };

        // Update queries to use both userId and email
        const [clearances, indigency, business, cedulas] = await Promise.all([
            BarangayClearance.find(baseQuery).sort({ createdAt: -1 }),
            BarangayIndigency.find(baseQuery).sort({ createdAt: -1 }),
            BusinessClearance.find(baseQuery).sort({ createdAt: -1 }),
            Cedula.find(baseQuery).sort({ createdAt: -1 })
        ]);

        // Combine and format all requests
        const allRequests = [
            ...clearances.map(doc => ({
                ...doc.toObject(),
                documentType: 'Barangay Clearance'
            })),
            ...indigency.map(doc => ({
                ...doc.toObject(),
                documentType: 'Barangay Indigency'
            })),
            ...business.map(doc => ({
                ...doc.toObject(),
                documentType: 'Business Clearance'
            })),
            ...cedulas.map(doc => ({
                ...doc.toObject(),
                documentType: 'Cedula'
            }))
        ];

        // Sort by creation date
        const sortedRequests = allRequests.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Apply pagination
        const paginatedRequests = sortedRequests.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            data: paginatedRequests,
            pagination: {
                total: allRequests.length,
                page,
                limit,
                totalPages: Math.ceil(allRequests.length / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Add this function to get a specific document request
export const getDocumentRequestById = async (req, res, next) => {
    try {
        const { id, type } = req.params;
        const userId = req.user._id;
        const { barangay } = req.user;

        let document;
        switch (type.toLowerCase()) {
            case 'clearance':
                document = await BarangayClearance.findOne({ _id: id, userId, barangay });
                break;
            case 'indigency':
                document = await BarangayIndigency.findOne({ _id: id, userId, barangay });
                break;
            case 'business':
                document = await BusinessClearance.findOne({ _id: id, userId, barangay });
                break;
            case 'cedula':
                document = await Cedula.findOne({ _id: id, userId, barangay });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid document type"
                });
        }

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document request not found"
            });
        }

        res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error("Error fetching document request:", error);
        next(error);
    }
};
