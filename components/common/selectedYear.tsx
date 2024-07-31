import { listOfAvailableYears } from "@/data/constants";
import { useQuerySearchParam } from "@/hooks/useQuerySearch";
import styles from './common.module.css'

interface SelectedYearProps {
    defaultValue?: number;
    hasResetButton?: boolean;
}

export const SelectedYear = ({ defaultValue, hasResetButton }: SelectedYearProps) => {
    const [selectedYear, setSelectedYear] = useQuerySearchParam({ name: "year", defaultValue: "", replace: false });
    return (
        <div className={styles.selectedYearWrapper}>
            {
                listOfAvailableYears.map((availableYear, index) => (
                    <a className={availableYear === parseInt(selectedYear, 10) ? styles.yearIsSelected : styles.year} key={index} onClick={() => setSelectedYear(`${availableYear}`)}>
                        {availableYear}
                    </a>
                ))
            }
            {hasResetButton && (
                <a className={styles.year} onClick={() => setSelectedYear("")}>
                Reset Filter
            </a>
            )}
        </div>

    )
}
