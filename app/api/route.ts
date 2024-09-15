import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import { embeddingQuery } from "@/lib/pinecone/pineconeUtils";
import { NextRequest, NextResponse } from "next/server";

import { update_db } from "@/lib/db/updateDb";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query");
    if (!query) {
        return NextResponse.json({
            msg: "bad request"
        }, {
            status: 400
        });
    }
    const embedding = await generateEmbeddings(query);
    const results = await embeddingQuery(embedding);

    return Response.json(results);
}

interface ResponseProps {
    searchQuery: string;
    searchResult: string;
    score: number;
}

export async function POST(request: Request) {
    try {
        const { searchQuery, searchResult, score } = await request.json() as ResponseProps;
        const postMethod = request.headers.get('Post-Method') as "increase" | "decrease";

        const response = await update_db({ searchQuery, searchResult, score, postMethod });
        return response;

    } catch (err) {
        console.error("Error in POST handler", err);
        return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
    }
}
