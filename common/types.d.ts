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