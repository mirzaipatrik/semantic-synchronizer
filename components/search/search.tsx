'use client';
import { useState, useEffect, useRef, RefObject, useContext } from "react";
import { SearchResultCards } from "./searchResultCards";
import { SearchResults } from "@/common/types";
import styles from './search.module.css'
import Loading from "../common/loading";

export const search = (query: string) => fetch(`/api?query=${query}`, {
    method: "GET",
}).then((response) => response.json());

export const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const searchInputRef: RefObject<HTMLInputElement> = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [relevanceIsSelected, setRelevanceIsSelected] = useState<boolean>(true);
    const [dateIsSelected, setDateIsSelected] = useState<boolean>(false);

    const handleRelevance: () => void = () => {
        !relevanceIsSelected && (
            setRelevanceIsSelected(true),
            setDateIsSelected(false)
        )
    }

    const handleDate: () => void = () => {
        !dateIsSelected && (
            setDateIsSelected(true),
            setRelevanceIsSelected(false)
        )
    }

    useEffect(() => {
        if (!searchQuery) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const results = await search(searchQuery);
                setSearchResults(results)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsLoading(false);
        };

        searchQuery && fetchData();
    }, [searchQuery]);

    return (
        <>
            <div className={styles.searchBodyWrapper}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    searchInputRef.current && setSearchQuery(searchInputRef.current.value);
                }}>
                    <label>
                        <input
                            className={styles.input}
                            type="search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={`Search`}
                            ref={searchInputRef}
                        />
                    </label>
                </form>
            </div>
            {isLoading && <Loading />}
            {!isLoading && searchResults && (
                <>
                    <div className={styles.searchDescription}>
                        <p className={styles.toggleTitle}>Order by:</p>
                        <p onClick={handleRelevance} className={relevanceIsSelected ? styles.yearIsSelected : styles.toggleButton}>Relevance</p>
                        <p onClick={handleDate} className={dateIsSelected ? styles.yearIsSelected : styles.toggleButton}>Date</p>
                    </div>
                    <SearchResultCards searchQuery={searchQuery} searchResults={searchResults} relevancyIsSelected={relevanceIsSelected}/>
                </>
            )}
        </>
    )

}