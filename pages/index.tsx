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

const LIMIT = 50;

const Home: NextPage = () => {
  const [fromYear, setFromYear] = useState(0);
  const [toYear, setToYear] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterText, setFilterText] = useState("");

  const { data, error } = useSWR(
    () =>
      fromYear && toYear
        ? `/api/auctions?limit=${
            currentPage * LIMIT
          }&start_year=${fromYear}&end_year=${toYear}`
        : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  console.log(totalPages);

  useEffect(() => {
    data?.totalPages && setTotalPages(data.totalPages);
  }, [data]);

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
            setCurrentPage(1);
          }}
          toYearHandler={(year: number) => {
            setToYear(year);
            setCurrentPage(1);
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
            out of <HighlightSpan>{data.totalResults}</HighlightSpan> total
            results.
          </Text>
        )}
        {data && currentPage < data.totalPages && (
          <Button onClick={() => setCurrentPage(currentPage + 1)}>
            Load more results
          </Button>
        )}
      </Container>
    </>
  );
};

export default Home;
