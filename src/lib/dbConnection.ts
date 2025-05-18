import mongoose, { Mongoose } from "mongoose";
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: null | Mongoose;
        promise: null | Promise<Mongoose>;
    }; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    const DB_URI = process.env.MONGODB_DB_URI_WITHOUT_CREDENTIALS;
    if (!DB_URI)
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local");

    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(DB_URI, {
            auth: {
                username: process.env.MONGODB_DB_USERNAME,
                password: process.env.MONGODB_DB_PASSWORD,
            },
            dbName: process.env.MONGODB_DB_NAME,
            bufferCommands: false,
        });
        console.log("first connection");
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
