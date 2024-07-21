import mongoose from 'mongoose';

interface ConnectionProps {
    isConnected?: number;
}

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const connection: ConnectionProps = {}

export async function dbConnect() {
    if (connection.isConnected) {
        return;
    }
    const db = await mongoose.connect(uri);
    console.log(db)
    connection.isConnected = db.connections[0].readyState;
}
