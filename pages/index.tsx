import type { NextPage } from "next";
import useSWR from "swr";
import { Container, Heading } from "@chakra-ui/react";
import ScatterPlot from "../components/ScatterPlot";
import AuctionFilters from "../components/AuctionFilters";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const [fromYear, setFromYear] = useState<number>(0);
  const [toYear, setToYear] = useState<number>(0);

  const { data, error } = useSWR(
    () =>
      fromYear && toYear
        ? `/api/scrape?start_year=${fromYear}&end_year=${toYear}`
        : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (error) return <div>failed to load</div>;

  return (
    <Container mt={5}>
      <Heading textAlign="center">Cars & Bids</Heading>
      <AuctionFilters
        fromYear={fromYear}
        fromYearHandler={(year: number) => setFromYear(year)}
        toYearHandler={(year: number) => setToYear(year)}
      />
      {fromYear && toYear ? <ScatterPlot cars={data?.cars || []} /> : null}
    </Container>
  );
};

export default Home;
