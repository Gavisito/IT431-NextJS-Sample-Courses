import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please add you MongoDB URI to .env.local")
}

// where mongo is running at. 
const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export default clientPromise