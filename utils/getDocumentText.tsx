import { Story } from "@/common/types";

export const getDocumentText = (story: Story): string => {
    let fullStoryText = story.description;
  
    story.storyContent.forEach((content) => {
      switch (content.__typename) {
        case 'ParagraphRecord':
          fullStoryText += content.paragraphText + "\n\n"; // Adding newline for better separation
          break;
        default:
          break;
      }
    });
  
    return fullStoryText.trim(); // Trim leading/trailing whitespace if necessary
  };