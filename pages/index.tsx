import type { NextPage } from "next";
import useSWR from "swr";
import { Container, Heading, Text } from "@chakra-ui/react";
import theme from "@chakra-ui/theme";
import ScatterPlot from "../components/ScatterPlot";
import AuctionFilters from "../components/AuctionFilters";
import React, { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const [fromYear, setFromYear] = useState<number>(0);
  const [toYear, setToYear] = useState<number>(0);
  const [transmission, setTransmission] = useState<Transmission>("all");
  const [bodyStyle, setBodyStyle] = useState<BodyStyle>("all");

  const { data, error } = useSWR(
    () =>
      fromYear && toYear
        ? `/api/scrape?start_year=${fromYear}&end_year=${toYear}&transmission=${transmission}&bodyStyle=${bodyStyle}`
        : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

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
        }}
        toYearHandler={(year: number) => setToYear(year)}
        transmissionHandler={(transmission: Transmission) =>
          setTransmission(transmission)
        }
        bodyStyleHandler={(bodyStyle: BodyStyle) => setBodyStyle(bodyStyle)}
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
      {fromYear && toYear ? <ScatterPlot cars={data?.cars || []} /> : null}
    </Container>
  );
};

export default Home;
