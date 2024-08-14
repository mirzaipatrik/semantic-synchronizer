import { PartitionedSearchResults, SearchResults } from "@/common/types"
import styles from './search.module.css'
import { Interweave } from "interweave";

export const SearchResultCards = (searchResults: SearchResults) => {

    // We do this in order to preserve that order of the scores
    const uniqueResults: Map<string, PartitionedSearchResults> = new Map();

    searchResults && searchResults.matches
        .forEach((match) => {
            const storyNumber = match.metadata.storyNumber;
            if (uniqueResults.has(storyNumber)) {
                uniqueResults.get(storyNumber)!.metadata.chunkedText += `<br /><br />${match.metadata.chunkedText}`;
            } else {
                uniqueResults.set(storyNumber, {
                    id: match.id,
                    metadata: {
                        storyDate: match.metadata.date,
                        storyTitle: match.metadata.title,
                        chunkedText: match.metadata.chunkedText,
                        storyNumber: match.metadata.storyNumber,
                    }
                })
            }
        });

    return (
        <div className={styles.container}>
            {
                [...uniqueResults.values()].map((result, index) => {
                    return (
                        <a href={`https://news.bahai.org/story/${result.metadata.storyNumber}/`} className={styles.card} key={index}>
                            <h3 className={styles.title}>{result.metadata.storyTitle}</h3>
                            <p className={styles.date}>{result.metadata.storyDate}</p>
                            <Interweave tagName="p" content={result.metadata.chunkedText} />
                        </a>
                    )
                })
            }
        </div>
    )
}