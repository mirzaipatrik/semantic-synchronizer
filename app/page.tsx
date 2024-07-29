import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import styles from "./page.module.css";
import { embeddingQuery, upsertData } from "@/lib/pinecone/pineconeUtils";
import { performDatoCmsRequest } from "@/lib/datocms/datocms";
import { Story, StoryContent } from "@/common/types";
import { chunkText } from "@/utils/storyParser";
import { getDocumentText } from "@/utils/getDocumentText";

const PAGE_CONTENT_QUERY = `
  query Home($language: SiteLocale, $skip: IntType) {
    allStories(locale: $language, first: 20, skip: $skip, filter: {date: {gt: "2022-01-01"}}) {
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


async function getData() {
  const allStories = [];
  let skip = 0;
  let moreStories = true;

  while (moreStories) {
    const response = await performDatoCmsRequest({ query: PAGE_CONTENT_QUERY, variables: { locale: "en", skip } });

    if (!response || !response.data || !response.data.allStories) {
      console.error("Unexpected response structure:", response);
      return null;
    }

    const { data: { allStories: fetchedStories } } = response;
    allStories.push(...fetchedStories);

    // Check if more stories are available
    if (fetchedStories.length < 20) {
      moreStories = false;
    } else {
      skip += 20;
    }
  }
  return allStories;
}

export default async function Home() {

  const allStories: Story[] = await getData() ?? [];
  let count = 0;

  // for (const story of allStories) {
  //   await upsertData(story);
  //   console.log(`${++count} out of ${allStories.length} indexed`)
  // }



  // const embedding = await generateEmbeddings("natural disaster");
  // const searchResult = await embeddingQuery(embedding);
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
