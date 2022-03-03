import type { NextPage } from "next";
import { ResponsiveScatterPlot, ScatterPlotDatum } from "@nivo/scatterplot";
import useSWR from "swr";

import { Car } from "./api/scrape";
import ScatterPlot from "../components/ScatterPlot";
import { Container, Heading } from "@chakra-ui/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const { data, error } = useSWR(
    "/api/scrape?start_year=2020&end_year=2020",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const graphData = data.cars.map((car: Car) => ({
    x: car.endDate,
    y: car.bidValue,
    name: car.name,
  }));

  return (
    <Container>
      <Heading textAlign="center">Cars & Bids </Heading>
      <div style={{ width: "100%", height: 300 }}>
        <ScatterPlot data={graphData} />
      </div>
    </Container>
  );
};

export default Home;
