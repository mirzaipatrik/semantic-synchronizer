import { PartitionedSearchResults, SearchResults } from "@/common/types"
import styles from './search.module.css'
import Link from "next/link"
import { Interweave } from "interweave";

export const SearchResultCards = (searchResults: SearchResults) => {

    const uniqueResults: { [key: number]: PartitionedSearchResults } = {};

    searchResults.matches.forEach((match) => {
        const storyNumber = match.metadata.storyNumber;
        if (uniqueResults[storyNumber]) {
            uniqueResults[storyNumber].metadata.chunkedText += `<br /><br />${match.metadata.chunkedText}`;
        } else {
            uniqueResults[storyNumber] = {
                id: match.id,
                metadata: {
                    storyDate: match.metadata.storyDate,
                    storyTitle: match.metadata.storyTitle,
                    chunkedText: match.metadata.chunkedText,
                    storyNumber: match.metadata.storyNumber,
                }
            };
        }
    });

    const groupedSearchResults = Object.values(uniqueResults)

    console.log(groupedSearchResults)

    return (
        <div className={styles.container}>
            {
                Object.values(uniqueResults).map((result, index) => {
                    return (
                        <a href={`https://news.bahai.org/story/${result.metadata.storyNumber}/`} className={styles.card} key={index}>
                            <h3 className={styles.title}>{result.metadata.storyTitle}</h3>
                            <p className={styles.date}>{result.metadata.storyDate}</p>
                            <p>
                                <Interweave content={result.metadata.chunkedText} tagName="p" />
                            </p>
                        </a>
                    )
                })
            }
        </div>
    )
}