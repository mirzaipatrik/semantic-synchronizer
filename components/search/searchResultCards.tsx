import { PartitionedSearchResults, SearchResults } from "@/common/types"
import styles from './search.module.css'
import { Interweave } from "interweave";

import { Image as DatoImage } from "react-datocms";
import { metadata } from '../../app/search/layout';


type SearchResultsProps = {
    searchResults: SearchResults;
    relevancyIsSelected: boolean;
}

export const SearchResultCards = ({ searchResults, relevancyIsSelected }: SearchResultsProps) => {

    // We do this in order to preserve that order of the scores
    const uniqueResults: Map<string, PartitionedSearchResults> = new Map();

    searchResults && searchResults.matches
        .forEach((match) => {
            const storyNumber = match.metadata.storyNumber;
            if (uniqueResults.has(storyNumber)) {
                uniqueResults.get(storyNumber)!.metadata.chunkedText += `<p>${match.metadata.chunkedText
                    .replace(match.metadata.description, "")
                    .replace(match.metadata.title, "")
                    .trim()
                    }</p>`;
            } else {
                uniqueResults.set(storyNumber, {
                    id: match.id,
                    metadata: {
                        storyDate: match.metadata.date,
                        storyTitle: match.metadata.title,
                        chunkedText: `<p>${match.metadata.chunkedText.replace(match.metadata.description, "").replace(match.metadata.title, "").trim()}</p>`,
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

    console.log(orderedSearchResults.entries());

    return (
        <div className={styles.container}>
            {[...(relevancyIsSelected ? uniqueResults.values() : orderedSearchResults.values())].map((result, index) => (
                <a
                    href={`https://news.bahai.org/story/${result.metadata.storyNumber}/`}
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
                </a>
            ))}
        </div>
    );
}