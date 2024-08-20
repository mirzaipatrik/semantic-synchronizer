import { MetaData } from "@/lib/pinecone/pineconeUtils";

type StoryContent =
  | ParagraphRecord
  | InlineVideoRecord
  | InlineQuoteRecord
  | PodcastRecord
  | ManualContentRecord;

export type Story = {
  date: string;
  storyNumber: string;
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

interface ResponsiveImage {
  src: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  base64: string;
}

export interface MetaData {
  [key: string]: any;
  storyDate: string;
  storyTitle: string;
  storyNumber: string;
  chunkedText: string;
}

export interface PartitionedSearchResults {
  id: string;
  metadata: MetaData
  responsiveImage: ResponsiveImage;
}