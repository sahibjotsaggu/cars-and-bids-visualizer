import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import useSWR from "swr";

type Car = {
  name: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const { data, error } = useSWR("/api/scrape", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <ul>
      {data.cars.map((car: Car, i: number) => (
        <li key={i}>{car.name}</li>
      ))}
    </ul>
  );
};

export default Home;
