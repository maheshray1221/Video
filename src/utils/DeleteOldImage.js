import { User } from "../models/user.model.js"
import { v2 as cloudinary } from 'cloudinary';


const deleteOldImage = async (oldImageUrl) => {
    try {
        if (!oldImageUrl) {
            return null
        }
        const user = await User.findOne(
            {
                $or: [
                    { "avatar.url": oldImageUrl },
                    { "coverImage.url": oldImageUrl }
                ]
            }
        )

        if (!user) return null

        let deleteAvatar = null
        let deleteCoverImage = null

        if (user.avatar?.public_id) {
            deleteAvatar = await cloudinary.uploader.destroy(user.avatar.public_id, {
                resource_type: "auto"
            })
        }

        if (user.coverImage?.public_id) {
            deleteCoverImage = await cloudinary.uploader.destroy(user.coverImage.public_id, {
                resource_type: "auto"
            })
        }

        return deleteAvatar || deleteCoverImage || null
    } catch (error) {
        console.log("deleting old Image Error:", error)
        return null
    }

}

export { deleteOldImage }