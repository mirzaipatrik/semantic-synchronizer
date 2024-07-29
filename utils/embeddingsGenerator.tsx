import { generateEmbeddings } from "@/lib/huggingface/tokenizer";

export const convertStoryChunksIntoEmbeddings = async (storyChunks: string[]) => {
  const embeddings: number[][] = [];
  for (const textChunk of storyChunks) {
    try {
      const embedding = await generateEmbeddings(textChunk);
      // Assuming generateEmbeddings returns a single array inside an array, e.g., [[number, number, ...]]
      if (embedding.length > 0 && Array.isArray(embedding)) {
        embeddings.push(embedding);
      }
    } catch (error) {
      console.log((error as Error).message);
    }

  }
  return embeddings;
}