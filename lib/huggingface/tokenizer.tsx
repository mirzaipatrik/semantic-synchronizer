import axios, { AxiosError } from "axios";

const hfToken = process.env.HF_TOKEN;
const embeddingUrl = process.env.EMBEDDING_MODEL_URL;

// Number of retry attempts
const MAX_RETRIES = 3;
// Delay between retries (in milliseconds)
const RETRY_DELAY = 2000;

export const generateEmbeddings = async (text: string): Promise<number[]> => {
    if (!hfToken || !embeddingUrl) {
        throw new Error('Invalid/Missing environment variables: "HF_TOKEN" or "EMBEDDING_MODEL_URL"');
    }

    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            const response = await axios.post(
                embeddingUrl,
                { inputs: text },
                { headers: { Authorization: `Bearer ${hfToken}` } }
            );

            return response.data[0] as number[];
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.code === "413") {
                throw new Error("Content too large")
            }
            attempt++;
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt >= MAX_RETRIES) {
                console.log("Max number of retries reached")
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }

    // This point is never reached because of the throw in the catch block
    throw new Error('Unexpected error');
};