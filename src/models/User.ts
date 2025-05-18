// import mongoose from "mongoose";

// interface UserD extends Document<Types.ObjectId>, BaseUserI {
//     password: string;
//     comparePassword: (candidatePassword: string) => Promise<boolean>;
//     toBaseUser: () => BaseUserI;
//     toUser: () => UserI;
// }

// const userSchema: Schema = new Schema<UserD>(
//     {
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//         firstName: { type: String, required: true },
//         lastName: { type: String, required: true },
//         role: { type: String, enum: ["admin", "user"], default: "user" },
//     },
//     {
//         timestamps: true,
//     }
// );

// userSchema.pre<UserD>("save", async function (next) {
//     try {
//         if (this.isNew || this.isModified("password")) {
//             this.password = await bcrypt.hash(this.password, 10);
//         }
//         next();
//     } catch (err) {
//         next(err as Error);
//     }
// });

// export const User = mongoose.models.User || mongoose.model("User", userSchema);
