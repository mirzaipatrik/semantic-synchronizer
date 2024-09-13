import { SearchResults } from '@/common/types';
import styles from '../layout.module.css';

export const ThumbsUpIcon = () => (
    <div className={styles.iconWrapper}>
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <path d="M3 10C3 9.44772 3.44772 9 4 9H7V21H4C3.44772 21 3 20.5523 3 20V10Z" stroke="#676767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 11V19L8.9923 20.3282C9.64937 20.7662 10.4214 21 11.2111 21H16.4586C17.9251 21 19.1767 19.9398 19.4178 18.4932L20.6119 11.3288C20.815 10.1097 19.875 9 18.6391 9H14" stroke="#676767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 9L14.6872 5.56415C14.8659 4.67057 14.3512 3.78375 13.4867 3.49558V3.49558C12.6336 3.21122 11.7013 3.59741 11.2992 4.4017L8 11H7" stroke="#676767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
);

export const ThumbsDownIcon = () => (
    <div className={styles.iconWrapper}>
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
            <path d="M21 14C21 14.5523 20.5523 15 20 15H17V3H20C20.5523 3 21 3.44772 21 4V14Z" stroke="#676767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 13V5L15.0077 3.6718C14.3506 3.23375 13.5786 3 12.7889 3H7.54138C6.07486 3 4.82329 4.06024 4.5822 5.5068L3.38813 12.6712C3.18496 13.8903 4.12504 15 5.36092 15H10" stroke="#676767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 15L9.31283 18.4358C9.13411 19.3294 9.64876 20.2163 10.5133 20.5044V20.5044C11.3664 20.7888 12.2987 20.4026 12.7008 19.5983L16 13H17" stroke="#676767" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
)


interface SearchResultProps {
    searchResult: SearchResults;
    searchQuery: string;
    storyNumber: string;
}

export const FeedbackWrapper = ({ searchResult, searchQuery, storyNumber }: SearchResultProps) => {

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
    };

    const changeScore = async (change: "increase" | "decrease") => {
        try {
            searchResult.matches.forEach(val => {
                if (val.metadata.storyNumber === storyNumber) {

                    // Call API to update the feedback
                    fetch('/api', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Post-Method': change
                        },
                        body: JSON.stringify({
                            searchQuery,
                            searchResult: val.metadata.chunkedText,
                            storyNumber,
                            score: val.score,
                        }),
                    })
                    .then(response => response.json())
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            });
        } catch (err) {
            console.error('Error increasing score:', err);
        }
    }

    return (
        <div
            className={styles.feedbackWrapper}
        >
            <div onClick={(e) => { handleClick(e); changeScore("increase"); }}>
                <ThumbsUpIcon />
            </div>
            <div onClick={(e) => { handleClick(e); changeScore("decrease"); }}>
                <ThumbsDownIcon />
            </div>
        </div>
    );
}
