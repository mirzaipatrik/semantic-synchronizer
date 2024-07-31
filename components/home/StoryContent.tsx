'use client';

import { Story } from "@/common/types";
import { getDocumentText } from "@/utils/getDocumentText";
import { chunkText } from "@/utils/storyParser";
import styles from "../../app/page.module.css";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { listOfAvailableYears } from "@/data/constants";

interface StoryContentProps {
  storiesByYear: { [key: number]: Story[] };
}

export function StoryContent({ storiesByYear }: StoryContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const year = params.get("year");
    if (year) {
      setSelectedYear(parseInt(year, 10));
    }
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    const queryString = createQueryString("year", String(year));
    window.history.pushState(null, "", `${pathname}?${queryString}`);
  };

  const allStories = storiesByYear[selectedYear] || [];

  return (
    <>
      <div className={styles.selectedYearWrapper}>
        {listOfAvailableYears.map((availableYear, index) => (
          <a className={availableYear===selectedYear ? styles.yearIsSelected : styles.year} key={index} onClick={() => handleYearClick(availableYear)}>
            {availableYear}
          </a>
        ))}
      </div>
      {allStories.length > 0 ? (
        allStories.map((story: Story, index: number) => (
          <div key={index}>
            <h2>{story.description}</h2>
            <p className={styles.date}>{story.date}</p>
            <div>
              {chunkText(getDocumentText(story)).map((chunk, chunkIndex) => (
                <p key={chunkIndex}>{chunk}</p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No stories available.</div>
      )}
    </>
  );
}
