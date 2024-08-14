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

const indexName = "bwns-test"
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
    storyNumber: string;
    chunkedText: string;
}

export const upsertData = async (story: Story) => {
    const pc = initiatePC();
    const index = pc.index(indexName);
    const chunkedText = chunkText(getDocumentText(story));
    const embeddings = await convertStoryChunksIntoEmbeddings(chunkedText);

    const partitionedData = embeddings.map((embedding, index) => ({
        id: `${story.storyNumber}-${index}`,
        values: embedding,
        metadata: {
            storyDate: story.date,
            storyTitle: story.description,
            chunkedText: chunkedText[index],
            storyNumber: story.storyNumber,
        }
    }));

    await index.namespace(`bwns-test`).upsert(partitionedData);
}

export const embeddingQuery = async (vector: number[]) => {
    const pc = initiatePC();
    const index = pc.index(indexName);

    if (!index) {
        throw ("no index exists");
    }

    try {
        const queryResponse = await index.query({
            topK: 20,
            vector: vector,
            includeValues: true,
            includeMetadata: true,
        });

        return queryResponse;

    } catch (error) {
        console.error(error);
    }
}
