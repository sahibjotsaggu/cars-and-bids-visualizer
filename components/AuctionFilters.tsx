import { useState } from "react";
import { Box, HStack, Select } from "@chakra-ui/react";

interface AuctionFiltersProps {
  fromYear: number;
  fromYearHandler: (year: number) => void;
  toYearHandler: (year: number) => void;
}

const AuctionFilters = ({
  fromYear,
  fromYearHandler,
  toYearHandler,
}: AuctionFiltersProps) => {
  const [years] = useState(new Array(42).fill(0).map((_, i) => 1981 + i));

  return (
    <Box mt={5}>
      <HStack>
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
        {/* <Select placeholder="Transmission">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
        <Select placeholder="Body Style">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select> */}
      </HStack>
    </Box>
  );
};

export default AuctionFilters;
