import Officials from "../models/officials.model.js";

export const createOfficial = async (req, res, next) => {
    try {
        const { name, position, contactNumber, image, barangay, createdBy } = req.body;

        // Validate required fields
        if (!name || !position || !contactNumber || !barangay) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Create new official with all fields
        const officialData = {
            name,
            position,
            contactNumber,
            barangay,  // Add barangay field
            status: "Active",
            createdBy // Add createdBy field
        };

        // Add image if provided
        if (image) {
            officialData.image = {
                filename: image.filename,
                contentType: image.contentType,
                data: image.data
            };
        }

        const official = new Officials(officialData);
        await official.save();

        res.status(201).json({
            success: true,
            message: "Official added successfully",
            official: {
                _id: official._id,
                name: official.name,
                position: official.position,
                contactNumber: official.contactNumber,
                barangay: official.barangay,
                status: official.status
            }
        });
    } catch (error) {
        console.error("Error creating official:", error);
        next(error);
    }
};

export const getOfficials = async (req, res, next) => {
    try {
        const officials = await Officials.find({ status: "Active" })
            .sort({ createdAt: -1 });

        // Transform the officials data to include image URLs
        const officialsWithImages = officials.map(official => {
            const officialObj = official.toObject();
            if (officialObj.image) {
                // Keep the image data for direct display
                officialObj.image = {
                    data: officialObj.image.data,
                    contentType: officialObj.image.contentType
                };
            }
            return officialObj;
        });

        res.status(200).json({
            success: true,
            officials: officialsWithImages
        });
    } catch (error) {
        next(error);
    }
};

export const getOfficialImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const official = await Officials.findById(id).select('image');

        if (!official || !official.image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        res.status(200).json({
            success: true,
            image: official.image
        });
    } catch (error) {
        next(error);
    }
};

export const getOfficialsByBarangay = async (req, res, next) => {
    try {
        const { barangay } = req.params;

        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "Barangay parameter is required"
            });
        }

        const officials = await Officials.find({
            barangay,
            status: "Active"
        }).sort({ createdAt: -1 });

        // Transform the officials data to include image URLs
        const officialsWithImages = officials.map(official => {
            const officialObj = official.toObject();
            if (officialObj.image) {
                officialObj.image = {
                    data: officialObj.image.data,
                    contentType: officialObj.image.contentType
                };
            }
            return officialObj;
        });

        res.status(200).json({
            success: true,
            officials: officialsWithImages,
            count: officials.length,
            barangay
        });
    } catch (error) {
        console.error("Error fetching officials by barangay:", error);
        next(error);
    }
};




