import { PartitionedSearchResults, SearchResults } from "@/common/types"
import styles from './search.module.css'
import { Interweave } from "interweave";
import { Image as DatoImage } from "react-datocms";
import { FeedbackWrapper } from "./searchAssets";

type SearchResultsProps = {
    searchResults: SearchResults;
    relevancyIsSelected: boolean;
    searchQuery: string;
}

export const SearchResultCards = ({ searchResults, relevancyIsSelected, searchQuery }: SearchResultsProps) => {

    // We do this in order to preserve that order of the scores
    const uniqueResults: Map<string, PartitionedSearchResults> = new Map();

    searchResults && searchResults.matches
        .forEach((match) => {
            const storyNumber = match.metadata.storyNumber;
            const cleanedText = match.metadata.chunkedText
                .replace(match.metadata.description, "")
                .replace(match.metadata.title, "")
                .trim();

            if (uniqueResults.has(storyNumber)) {
                if (cleanedText) {
                    uniqueResults.get(storyNumber)!.metadata.chunkedText += `<p>${cleanedText}</p>`;
                }
            } else {
                uniqueResults.set(storyNumber, {
                    id: match.id,
                    metadata: {
                        storyDate: match.metadata.date,
                        storyTitle: match.metadata.title,
                        chunkedText: cleanedText ? `<p>${cleanedText}</p>` : "",
                        storyNumber: match.metadata.storyNumber,
                        description: match.metadata.description
                    },
                    responsiveImage: {
                        sizes: match.metadata.sizes,
                        src: match.metadata.src,
                        width: match.metadata.width,
                        height: match.metadata.height,
                        alt: "",
                        title: "",
                        base64: match.metadata.base64
                    }
                })
            }
        });


    // Use this for soring by date (descending)
    const orderedSearchResults = new Map([...uniqueResults.entries()].sort().reverse());

    return (
        <div className={styles.container}>
            {[...(relevancyIsSelected ? uniqueResults.values() : orderedSearchResults.values())].map((result, index) => (
                <a
                    href={`https://news.bahai.org/story/${result.metadata.storyNumber}/`}
                    target="_blank"
                    className={styles.card}
                    key={index}
                >
                    <div className={styles.resultsIntro}>
                        <div>
                            <h3 className={styles.title}>{result.metadata.storyTitle}</h3>
                            <p className={styles.date}>{result.metadata.storyDate}</p>
                            <h6 className={styles.descriptionLine}>{result.metadata.description}</h6>
                        </div>
                        <div className={styles.figureStyles}>
                            <DatoImage data={result.responsiveImage} />
                        </div>
                    </div>
                    <Interweave className={styles.searchResultParagraph} tagName="div" content={result.metadata.chunkedText} />
                    <FeedbackWrapper storyNumber={result.metadata.storyNumber} searchQuery={searchQuery} searchResult={searchResults} />
                </a>
            ))}
        </div>
    );
}