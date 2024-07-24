import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import styles from "./page.module.css";
import { embeddingQuery } from "@/lib/pinecone/pineconeUtils";
import { performDatoCmsRequest } from "@/lib/datocms/datocms";
import { Story } from "@/common/types";
import { chunkText } from "@/utils/storyParser";
import { getDocumentText } from "@/utils/getDocumentText";

const PAGE_CONTENT_QUERY = `
  query Home {
    allStories(filter: {date: {gt: "2022-01-01"}}, locale: en) {
    storyNumber
    date
    description
    storyContent {
      __typename
      ... on ParagraphRecord {
        paragraphText
      }
    }
  }
  }`;

export default async function Home() {
  const { data: { allStories } } = await performDatoCmsRequest({ query: PAGE_CONTENT_QUERY });
  // upsertData(allStories as Story[]);

  const embedding = await generateEmbeddings("natural disaster");
  const searchResult = await embeddingQuery(embedding);
  return (
    <main className={styles.main}>
      <div>
        <h1>Story Content</h1>
        {allStories.length > 0 ? (
          allStories.map((story: Story, index: number) => (
            <div key={index}>
              <h2>{story.description}</h2>
              <div>
                {chunkText(getDocumentText(story)).map((chunk, chunkIndex) => (
                  <p key={chunkIndex}>{chunk}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>No stories available.</div>
        )}
      </div>
    </main>
  );
}
