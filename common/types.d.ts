import { MetaData } from "@/lib/pinecone/pineconeUtils";

type StoryContent =
  | ParagraphRecord
  | InlineVideoRecord
  | InlineQuoteRecord
  | PodcastRecord
  | ManualContentRecord;

export type Story = {
  date: string;
  storyNumber: number;
  description: string;
  storyContent: StoryContent[]; // Array of content items
};

export interface SearchResults {
  matches: {
      id: string;
      metadata: MetaData;
      score: number;
  }[];
}

export interface PartitionedSearchResults {
  id: string;
  metadata: MetaData
}