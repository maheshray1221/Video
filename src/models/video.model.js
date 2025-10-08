import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from
 "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,// cloudinary url 
            required: true,
        },
        views: {
            type: Number,
           default:0,
        },
        isPublished: {
            type: Boolean,
            default:true,
        },
        thumbnail: {
            type: String,// cloudinary url 
            required: true,
        },
        videoFile: {
            type: String, // cloudinary url 
            required: true,
        }

    }, { timestamps: true }
)
videoSchema.plugin(mongooseAggregatePaginate);

export const video = mongoose.model("Video", videoSchema);