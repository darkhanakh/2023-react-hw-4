import Head from "next/head";
import { Inter } from "next/font/google";
import axios from "axios";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export async function getServerSideProps({ query }) {
  const { id } = query;
  const response = await axios.get(defaultEndpoint + "/" + id);
  return {
    props: {
      data: response.data,
    },
  };
}
export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status } = data;
  return (
      <div className="container">
        <Head>
          <title>{ name }</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="title">{ name }</h1>

          <div className="profile">
            <div className="profile-image">
              <img src={image} alt={name} />
            </div>
            <div className="profile-details">
              <h2>Character Details</h2>
              <ul>
                <li>
                  <strong>Name:</strong> { name }
                </li>
                <li>
                  <strong>Status:</strong> { status }
                </li>
                <li>
                  <strong>Gender:</strong> { gender }
                </li>
                <li>
                  <strong>Species:</strong> { species }
                </li>
                <li>
                  <strong>Location:</strong> { location?.name }
                </li>
                <li>
                  <strong>Originally From:</strong> { origin?.name }
                </li>
              </ul>
            </div>
          </div>

          <p className="back">
            <Link href="/">
                Back to All Characters
            </Link>
          </p>
        </main>
    </div>
  );
}
