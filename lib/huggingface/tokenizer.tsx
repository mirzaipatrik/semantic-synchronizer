import axios from "axios";

const hfToken = process.env.NEXT_PUBLIC_HF_TOKEN;
const embeddingUrl = process.env.NEXT_PUBLIC_EMBEDDING_MODEL_URL;

export const generateEmbeddings = async (text: string) => {
    if (!hfToken || !embeddingUrl) {
        throw new Error('Invalid/Missing environment variables: "NEXT_PUBLIC_HF_TOKEN" or "NEXT_PUBLIC_EMBEDDING_MODEL_URL"');
    }

    try {
        const response = await axios.post(
            embeddingUrl,
            { inputs: text },
            { headers: { Authorization: `Bearer ${hfToken}` } }
        );
        if (response.status !== 200) {
            throw new Error(`Request failed with status code ${response.status}`);
        }
        return response.data as number[];
    } catch (error) {
        console.error(error);
        throw error; // Optionally rethrow the error after logging it
    }
};
