import { SearchResults } from "@/common/types"
import styles from './search.module.css'
import Link from "next/link"

export const SearchResultCards = (searchResults: SearchResults) => {
    return (
        <div className={styles.container}>
            {
                searchResults.matches.map((result, index) => {
                    return (
                        <a href={`https://news.bahai.org/story/${result.metadata.storyNumber}/`} className={styles.card} key={index}>
                            <h3 className={styles.title}>{result.metadata.storyTitle}</h3>
                            <p className={styles.date}>{result.metadata.storyDate}</p>
                            <p>{result.metadata.chunkedText}</p>
                        </a>
                    )
                })
            }
        </div>
    )
}