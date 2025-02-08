import mongoose, { Schema } from "mongoose"

const todoSchema = new Schema({
    todoText: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const Todo = mongoose.model("Todo", todoSchema)

export default Todo