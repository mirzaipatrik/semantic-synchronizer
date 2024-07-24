import { SearchResults } from "@/common/types"
import styles from './search.module.css'

export const SearchResultCards = (searchResults: SearchResults) => {
    return (
        <div className={styles.container}>
            {
                searchResults.matches.map((result, index) => {
                    return (
                        <div className={styles.card} key={index}>
                            <h3>{result.metadata.storyTitle}</h3>
                            <p className={styles.date}>{result.metadata.storyDate}</p>
                            <p>{result.metadata.chunkedText}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}