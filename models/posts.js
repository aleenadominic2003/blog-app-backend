const Mongoose = require("mongoose")

const postSchema = Mongoose.Schema(
    {

        //LOGIN -> POST -> LINK POST userId linked to the objectId of users schema 
        userId : {
            type: Mongoose.Schema.Types.ObjectId, //automatic id of a user after login
            ref: "users" //linked with objectId from "users" schema - similar to concept of foreign key
        },
        message: String,
        postedDate: {
            type: Date,
            default: Date.now
        }

    }
)

var postModel=Mongoose.model("posts",postSchema)
module.exports=postModel