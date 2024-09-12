import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Helper function to initialize the MongoClient
async function getClient(): Promise<MongoClient> {
    if (!uri) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }
    if (!clientPromise) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        clientPromise = client.connect();
    }
    return clientPromise;
}

interface DbProps {
    searchQuery: string;
    searchResult: string;
    score: number;
    postMethod: "increase" | "decrease";
}

interface DbResponse {
    sentence1: string;
    sentence2: string;
    score: number;
}

const handleScore = (postMethod: "increase" | "decrease", currentScore: number) => {
    if (postMethod === "increase") {
        return Math.min(currentScore + 0.1, 1);
    } else {
        return Math.max(currentScore - 0.1, 0);
    }
};

export async function update_db({ searchQuery, searchResult, score, postMethod }: DbProps) {
    try {
        const client = await getClient();
        const database = client.db("semantic-search");
        const fineTuningEntries = database.collection("fine-tuning");

        const data = await fineTuningEntries.findOne({ sentence1: searchQuery, sentence2: searchResult }) as DbResponse | null;
        const newScore = handleScore(postMethod, data?.score ?? score);

        if (data === null) {
            await fineTuningEntries.insertOne({ sentence1: searchQuery.trim(), sentence2: searchResult.trim(), score: newScore });
        } else {
            await fineTuningEntries.updateOne(
                { sentence1: searchQuery.trim(), sentence2: searchResult.trim() },
                { $set: { score: newScore } }
            );
        }

        return new Response(JSON.stringify({ status: 200, message: "Record successfully processed" }), { status: 200 });

    } catch (err) {
        console.error("Database operation failed", err);
        return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchQuery, searchResult, score } = await request.json() as DbProps;
        const postMethod = request.headers.get('Post-Method') as "increase" | "decrease";
        console.log(postMethod);

        const response = await update_db({ searchQuery, searchResult, score, postMethod });
        return response;

    } catch (err) {
        console.error("Error in POST handler", err);
        return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
    }
}
