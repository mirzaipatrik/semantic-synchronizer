'use client'
import { generateEmbeddings } from "@/lib/huggingface/tokenizer";
import { FormEvent, useEffect, useState } from "react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [embeddings, setEmbeddings] = useState<number[]>([]); // [embedding1, embedding2, ...]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vectorOfEmbeddings = await generateEmbeddings(searchQuery);
        setEmbeddings(vectorOfEmbeddings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchQuery]);

  return (
    <main>
      <div>
        <h1>Search</h1>
        <p>Search content goes here.</p>
        <form onSubmit={(e) => { e.preventDefault(); console.log(searchQuery) }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={"Search for content"}
          />
        </form>
      </div>
    </main>
  );
}