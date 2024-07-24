import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import { embeddingQuery } from "@/lib/pinecone/pineconeUtils";
import { NextRequest, NextResponse } from "next/server";

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