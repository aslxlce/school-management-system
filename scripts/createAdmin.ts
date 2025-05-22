// scripts/createAdmin.ts
import dotenv from "dotenv"; // Load environment variables from .env file
dotenv.config({
    path: "./.env.local", // Specify the path to your .env file
});
import { AdminModel } from "@/models/User";
import dbConnect from "@/lib/dbConnection";

async function createAdmin() {
    await dbConnect();

    const newAdmin = new AdminModel({
        username: "adminUser",
        password: "adminpass", // Will be hashed automatically
    });

    await newAdmin.save();
    console.log("✅ Admin created successfully");
    process.exit(0); // Exit cleanly
}

createAdmin().catch((err) => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
});
