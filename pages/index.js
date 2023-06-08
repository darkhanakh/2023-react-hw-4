import Head from "next/head";
import { Inter } from "next/font/google";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export async function getServerSideProps() {
  const response = await axios.get(defaultEndpoint);
  return {
    props: {
      data: response.data,
    },
  };
}
export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const response = await axios.get(current);
      const nextData = response.data;

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  const loadMore = () => {
    updatePage((prev) => {
      return { ...prev, current: page?.next };
    });
  };

  const handleOnSubmitSearch = (e) => {
    e.preventDefault();
    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget.elements);
    const fieldQuery = fields.find((field) => field.name === "query");
    const value = fieldQuery.value || "";
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint,
    });
  };

  return (
    <div className="container">
      <Head>
        <title>Wubba Lubba Dub dub!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Wubba Lubba Dub dub!</h1>
        <p className="description">Rick and Morty wiki :D</p>
        <form className="search" onSubmit={handleOnSubmitSearch}>
          <input type="search" name="query" />
          <button>Search</button>
        </form>
        <ul className="grid">
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <li key={id} className="card">
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <img src={image} alt={`${name} Thumbnail`} />
                  <h3>{name}</h3>
                </Link>

              </li>
            );
          })}
        </ul>
        <p>
          <button onClick={loadMore}>Load more</button>
        </p>
      </main>
    </div>
  );
}
