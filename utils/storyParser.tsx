export const chunkText = (fullStoryText: string) => {
  const sentences = fullStoryText.split("\n\n");
  const chunks: string[] = [];

  sentences.forEach((paragraph) => {
    chunks.push(paragraph);
  }
  );

  return chunks;
};