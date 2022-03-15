import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import theme from "@chakra-ui/theme";
import ScatterPlot from "../components/ScatterPlot";
import AuctionFilters from "../components/AuctionFilters";
import { Car } from "./api/scrape";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export type Transmission = "all" | "automatic" | "manual";
// export type BodyStyle =
//   | "all"
//   | "coupe"
//   | "convertible"
//   | "hatchback"
//   | "sedan"
//   | "suv/crossover"
//   | "truck"
//   | "van/minivan"
//   | "wagon";

const HighlightSpan = ({ children }: { children?: React.ReactNode }) => {
  return (
    <span
      style={{
        color: theme.colors.blue[400],
      }}
    >
      {children}
    </span>
  );
};

const Home: NextPage = () => {
  const [fromYear, setFromYear] = useState<number>(0);
  const [toYear, setToYear] = useState<number>(0);
  const [limit, setLimit] = useState(50);
  // const [transmission, setTransmission] = useState<Transmission>("all");
  // const [bodyStyle, setBodyStyle] = useState<BodyStyle>("all");
  // const [carsData, setCarsData] = useState<Car[]>([]);
  const [filterText, setFilterText] = useState("");

  const { data, error } = useSWR(
    () =>
      fromYear && toYear
        ? `/api/auctions?limit=${limit}&start_year=${fromYear}&end_year=${toYear}`
        : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (error) return <div>failed to load</div>;

  // const filterResults = () => {
  //   const filteredResults = carsData.filter((car) =>
  //     car.name.includes(filterText)
  //   );
  //   setCarsData(filteredResults);
  // };

  return (
    <>
      <Head>
        <title>Cars & Bids Visualization</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container mt={5} maxW="container.lg">
        <Heading textAlign="center">Cars & Bids Visualization</Heading>
        <AuctionFilters
          fromYear={fromYear}
          fromYearHandler={(year: number) => {
            if (year > toYear) {
              setToYear(0);
            }
            setFromYear(year);
          }}
          toYearHandler={(year: number) => {
            setToYear(year);
          }}
          // transmissionHandler={(transmission: Transmission) => {
          //   setTransmission(transmission);
          // }}
          // bodyStyleHandler={(bodyStyle: BodyStyle) => {
          //   setBodyStyle(bodyStyle);
          // }}
        />

        {fromYear && toYear && data ? (
          <Box>
            <Container mt={4}>
              <HStack>
                <Input
                  placeholder="Filter search results"
                  value={filterText}
                  onChange={(e) => setFilterText(e.currentTarget.value)}
                />
                <Button
                  w={150}
                  colorScheme="blue"
                  // onClick={() => filterResults()}
                >
                  Filter
                </Button>
              </HStack>
            </Container>
            <Heading mt={5} size="xs" textAlign="center">
              Bid values for {fromYear}-{toYear} vehicles.
            </Heading>
          </Box>
        ) : null}
        {fromYear && toYear && data ? <ScatterPlot cars={data.cars} /> : null}
        {data && (
          <Text
            mt={2}
            fontSize="xs"
            fontWeight="bold"
            sx={{ textTransform: "uppercase" }}
          >
            Currently showing <HighlightSpan>{data.cars.length}</HighlightSpan>{" "}
            out of <HighlightSpan>{data.total}</HighlightSpan> total results.
          </Text>
        )}
      </Container>
    </>
  );
};

export default Home;
