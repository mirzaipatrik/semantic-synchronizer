import axios from "axios";

const hfToken = process.env.HF_TOKEN;
const embeddingUrl = process.env.EMBEDDING_MODEL_URL;

export const generateEmbeddings = async (text: string) => {
    if (!hfToken || !embeddingUrl) {
        throw new Error('Invalid/Missing environment variables: "HF_TOKEN" or "EMBEDDING_MODEL_URL"');
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
