import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    email: string;
    password?: string;
    provider: string;
    email_verified: boolean;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, },
    provider: { type: String, default: "credentials" },
    email_verified: { type: Boolean, default: false },
    image: { type: String },
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    console.log("this.password: ", this.password);
    
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


const User = models.user || model<IUser>("user", userSchema);

export default User