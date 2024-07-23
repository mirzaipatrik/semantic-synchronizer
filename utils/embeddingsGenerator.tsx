import { generateEmbeddings } from "@/lib/huggingface/tokenizer";

export const convertStoryChunksIntoEmbeddings = async (storyChunks: string[]) => {
    const embeddings: number[][] = []
    for (const textChunk of storyChunks) {
      const embedding = await generateEmbeddings(textChunk);
      embeddings.push(embedding)
      console.log(embedding);
    }
    return embeddings
  }