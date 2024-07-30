import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import styles from "./page.module.css";
import { embeddingQuery, upsertData } from "@/lib/pinecone/pineconeUtils";
import { performDatoCmsRequest } from "@/lib/datocms/datocms";
import { Story } from "@/common/types";
import { chunkText } from "@/utils/storyParser";
import { getDocumentText } from "@/utils/getDocumentText";
import { useEffect } from "react";
import { StoryContent } from "@/components/home/StoryContent";

async function getData(year: number) {

  const PAGE_CONTENT_QUERY = `
  query Home($language: SiteLocale, $skip: IntType, $yearStart: Date, $yearEnd: Date) {
    allStories(locale: $language, first: 20, skip: $skip, filter: {date: {gt: $yearStart, lt: $yearEnd}},orderBy: date_DESC) {
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

  const allStories = [];
  let skip = 0;
  let moreStories = true;

  while (moreStories) {
    const response = await performDatoCmsRequest({
      query: PAGE_CONTENT_QUERY,
      variables: {
        language: "en",
        skip,
        yearStart: `${year}-01-01`,
        yearEnd: `${year}-12-31`
      }
    });

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
  const listOfAvailableYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const storiesByYear: { [key: number]: Story[] } = {};

  for (const year of listOfAvailableYears) {
    const stories: Story[] = await getData(year) ?? [];
    storiesByYear[year] = stories;
  }



  // const allStories: Story[] = await getData(2024) ?? [];
  // let count = 0;

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
        <StoryContent storiesByYear={storiesByYear} />
      </div>
    </main>
  );
}
