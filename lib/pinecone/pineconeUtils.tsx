import { Story } from '@/common/types';
import { convertStoryChunksIntoEmbeddings } from '@/utils/embeddingsGenerator';
import { getDocumentText } from '@/utils/getDocumentText';
import { chunkText } from '@/utils/storyParser';
import { Pinecone } from '@pinecone-database/pinecone';

const initiatePC = () => {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        throw new Error('Invalid/Missing environment variable: "PINECONE_API_KEY"');
    }
    const pc = new Pinecone({ apiKey: apiKey });
    return pc;

}

const indexName = "bwns-stories"
export const createPineconeIndex = async () => {
    const pc = initiatePC();
    await pc.createIndex({
        name: indexName,
        dimension: 384,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1'
            }
        }
    });
}

export interface MetaData {
    [key: string]: any;
    storyDate: string;
    storyTitle: string;
    storyNumber: number;
    chunkedText: string;
}

interface PartitionedData {
    id: string;
    values: number[];
    metadata: MetaData
}

export const upsertData = async (story: Story) => {
    const pc = initiatePC();
    const index = pc.index(indexName);
    const chunkedText = chunkText(getDocumentText(story));
    const embeddings = await convertStoryChunksIntoEmbeddings(chunkedText);

    // Map through the embeddings and push them to the partitionedData array together with the metadata
    // The metadata will be used later on to retrieve the story information and show the chunked text as search results
    const partitionedData: PartitionedData[] = embeddings.map((embedding, index) => ({
        id: `${story.storyNumber}-${index}`,
        values: embedding,
        metadata: {
            storyDate: story.date,
            storyTitle: story.description,
            chunkedText: chunkedText[index],
            storyNumber: story.storyNumber,
        }
    }));

    // Upsert the partitioned data to the Pinecone index with namespace "BWNS-Stories"
    await index.namespace(`BWNS-Stories`).upsert(
        partitionedData
    );
}

export const embeddingQuery = async (vector: number[]) => {
    const pc = initiatePC();
    const index = pc.index(indexName);

    if (!index) {
        throw ("no index exists")
    }

    try {
        const queryResponse = await index.namespace("BWNS-Stories").query({
            topK: 10,
            vector: vector,
            includeValues: true,
            includeMetadata: true,
        });

        return queryResponse;

    } catch (error) {
        console.error(error)
    }


}