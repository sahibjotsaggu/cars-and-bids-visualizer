import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import useSWR from "swr";
import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import theme from "@chakra-ui/theme";
import ScatterPlot from "../components/ScatterPlot";
import AuctionFilters from "../components/AuctionFilters";
import { Car } from "./api/scrape";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PAGE_SIZE = 50;

export type Transmission = "all" | "automatic" | "manual";
export type BodyStyle =
  | "all"
  | "coupe"
  | "convertible"
  | "hatchback"
  | "sedan"
  | "suv/crossover"
  | "truck"
  | "van/minivan"
  | "wagon";

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
  const [page, setPage] = useState(1);
  const [fromYear, setFromYear] = useState<number>(0);
  const [toYear, setToYear] = useState<number>(0);
  const [transmission, setTransmission] = useState<Transmission>("all");
  const [bodyStyle, setBodyStyle] = useState<BodyStyle>("all");
  const [carsData, setCarsData] = useState<Car[]>([]);

  const { data, error } = useSWR(
    () =>
      fromYear && toYear
        ? `/api/scrape?page=${page}&start_year=${fromYear}&end_year=${toYear}&transmission=${transmission}&bodyStyle=${bodyStyle}`
        : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  /**
   * if the new data.cars has length AND (the current carsData's length isn't
   * equal to page * PAGE_SIZE OR page * PAGE_SIZE > carsData.length)
   */

  /**
   * TODO: This breaks when loading the last page of results
   *  (if the last page doesn't have PAGE_SIZE results)
   */
  useEffect(() => {
    if (
      data?.cars.length &&
      (page * PAGE_SIZE !== carsData.length ||
        page * PAGE_SIZE > carsData.length)
    ) {
      setCarsData(carsData.concat(data?.cars));
    }
  }, [carsData, data?.cars, page]);

  if (error) return <div>failed to load</div>;

  return (
    <Container mt={5} maxW="container.lg">
      <Heading textAlign="center">Cars & Bids</Heading>
      <AuctionFilters
        fromYear={fromYear}
        fromYearHandler={(year: number) => {
          if (year > toYear) {
            setToYear(0);
          }
          setFromYear(year);
          setPage(1);
          setCarsData([]);
        }}
        toYearHandler={(year: number) => {
          setToYear(year);
          setPage(1);
          setCarsData([]);
        }}
        transmissionHandler={(transmission: Transmission) => {
          setTransmission(transmission);
          setPage(1);
          setCarsData([]);
        }}
        bodyStyleHandler={(bodyStyle: BodyStyle) => {
          setBodyStyle(bodyStyle);
          setPage(1);
          setCarsData([]);
        }}
      />
      {fromYear && toYear ? (
        <Text
          mt={2}
          fontSize="xs"
          fontWeight="bold"
          sx={{ textTransform: "uppercase" }}
        >
          Showing bid results for vehicles with model years between{" "}
          <HighlightSpan>{fromYear}</HighlightSpan> to{" "}
          <HighlightSpan>{toYear}</HighlightSpan> with{" "}
          {transmission !== "manual" ? "an " : "a "}
          <HighlightSpan>
            {transmission === "all" ? "automatic or manual" : transmission}
          </HighlightSpan>{" "}
          transmission and has a body style of{" "}
          <HighlightSpan>{bodyStyle}</HighlightSpan>.
        </Text>
      ) : null}
      {fromYear && toYear && data?.cars.length ? (
        <Heading mt={5} size="xs" textAlign="center">
          Bid values for {fromYear}-{toYear}, {transmission} transmission
          {transmission === "all" ? "s" : ""}, {bodyStyle} vehicles.
        </Heading>
      ) : null}
      {fromYear && toYear ? <ScatterPlot cars={carsData} /> : null}
      {data && (
        <Text
          mt={2}
          fontSize="xs"
          fontWeight="bold"
          sx={{ textTransform: "uppercase" }}
        >
          Currently showing <HighlightSpan>{carsData.length}</HighlightSpan> out
          of <HighlightSpan>{data.total}</HighlightSpan> total results.
        </Text>
      )}
      {carsData.length ? (
        <Button mt={2} onClick={() => setPage(page + 1)} isLoading={!data}>
          Load more results
        </Button>
      ) : null}
    </Container>
  );
};

export default Home;
