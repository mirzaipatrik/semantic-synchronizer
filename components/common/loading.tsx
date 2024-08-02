import styles from './common.module.css'

const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.loader} />
        </div>
    );
};

export default Loading;
