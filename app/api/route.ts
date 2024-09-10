import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import { embeddingQuery } from "@/lib/pinecone/pineconeUtils";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

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

export async function POST(request: Request) {
    try {
        const { searchQuery, searchResult, storyNumber, score } = await request.json();
        const filePath = path.join(process.cwd(), 'fine-tuning.json');
        const postMethod = request.headers.get('post-methood');

        let newScore = 0;

        try {

            const data = await fs.readFile(filePath, 'utf8');
            let currentData = await JSON.parse(data);


            if (!Array.isArray(currentData.entries)) {
                currentData.entries = [];
            }

            let uniqueData = new Map();

            currentData.entries.forEach((element: any) => {
                const key = `${element.sentence1}-${element.sentence2}`;
                uniqueData.set(key, {
                    sentence1: element.sentence1,
                    sentence2: element.sentence2,
                    score: element.score
                })
            })

            console.log(uniqueData)

            // Check our unique list to see whether our object exists, otherwise add it there
            const uniqueKey = `${searchQuery}-${searchResult}`;

            if (uniqueData.has(uniqueKey)) {
                const currentScore = uniqueData.get(uniqueKey).score;

                uniqueData.set(uniqueKey, {
                    sentence1: searchQuery,
                    sentence2: searchResult,
                    score: postMethod === "increase" ?
                        (
                            newScore = Math.min(currentScore + 0.1, 1)
                        ) :
                        (
                            newScore = Math.max(currentScore - 0.1, 0)
                        )
                })
            }
            else {
                uniqueData.set(uniqueKey, {
                    sentence1: searchQuery,
                    sentence2: searchResult,
                    score: postMethod === "increase" ?
                    (
                        newScore = Math.min(newScore + 0.1, 1)
                    ) :
                    (
                        newScore = Math.max(newScore - 0.1, 0)
                    )
                })
            }

            currentData.entries = Array.from(uniqueData.values());
            
            // Write updated data to the file
            const updatedJson = JSON.stringify(currentData, null, 2);
            await fs.writeFile(filePath, updatedJson);
        } catch (err) {
            console.log(err)
        }

        return Response.json({ searchQuery, searchResult, storyNumber, score })
    } catch (err) {
        console.log(err)
    }

}