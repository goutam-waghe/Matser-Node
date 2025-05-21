import mongoose from "mongoose";
import { type } from "os";
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    title: { type: String, require: true },
    description: { type: String, require: true },
},
    {
        timestamps: true,
        typeCast: true
    }
);

const taskModel = mongoose.model("tasks", taskSchema);

export default taskModel;