import { useState } from "react";
import { Box, FormControl, FormLabel, HStack, Select } from "@chakra-ui/react";
// import { BodyStyle, Transmission } from "../pages";

interface AuctionFiltersProps {
  fromYear: number;
  fromYearHandler: (year: number) => void;
  toYearHandler: (year: number) => void;
  // transmissionHandler: (transmission: Transmission) => void;
  // bodyStyleHandler: (bodyStyle: BodyStyle) => void;
}

const AuctionFilters = ({
  fromYear,
  fromYearHandler,
  toYearHandler,
}: // transmissionHandler,
// bodyStyleHandler,
AuctionFiltersProps) => {
  const [years] = useState(new Array(42).fill(0).map((_, i) => 1981 + i));

  return (
    <Box mt={5}>
      <HStack>
        <FormControl>
          <FormLabel>From Year</FormLabel>
          <Select
            placeholder="From Year"
            onChange={(e) => fromYearHandler(Number(e.currentTarget.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>To Year</FormLabel>
          <Select
            placeholder="To Year"
            onChange={(e) => toYearHandler(Number(e.currentTarget.value))}
          >
            {years.slice(fromYear ? fromYear - 1981 : 0).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl>
          <FormLabel>Transmission</FormLabel>
          <Select
            placeholder="Transmission"
            onChange={(e) =>
              transmissionHandler(
                (e.currentTarget.value as Transmission) || "all"
              )
            }
          >
            <option value="all">All</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Body Style</FormLabel>
          <Select
            placeholder="Body Style"
            onChange={(e) =>
              bodyStyleHandler((e.currentTarget.value as BodyStyle) || "all")
            }
          >
            <option value="all">All</option>
            <option value="coupe">Coupe</option>
            <option value="convertible">Convertible</option>
            <option value="hatchback">Hatchback</option>
            <option value="sedan">Sedan</option>
            <option value="suv/crossover">SUV/Crossover</option>
            <option value="truck">Truck</option>
            <option value="van/minivan">Van/Minivan</option>
            <option value="wagon">Wagon</option>
          </Select>
        </FormControl> */}
      </HStack>
    </Box>
  );
};

export default AuctionFilters;
