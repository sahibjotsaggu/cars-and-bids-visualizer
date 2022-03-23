import React, { useState } from "react";
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  console.log({ data });

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
        />

        {/* {fromYear && toYear && data ? (
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
        ) : null} */}
        {fromYear && toYear ? <ScatterPlot data={data} /> : null}
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
