import { Box, Spinner } from "@chakra-ui/react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { Car } from "../pages/api/scrape";

const ScatterPlot = ({ cars }: { cars: Car[] }) => (
  <Box w="100%" h={300}>
    {cars.length ? (
      <ResponsiveScatterPlot
        data={[
          {
            id: "snaek",
            data: cars.map((car: Car) => ({
              x: car.endDate,
              y: car.bidValue,
              name: car.name,
            })),
          },
        ]}
        margin={{ top: 20, right: 20, bottom: 70, left: 80 }}
        xScale={{ type: "time", format: "%Y-%m-%d" }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: "linear", min: 0, max: "auto" }}
        yFormat={(number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(number as number)
        }
        blendMode="multiply"
        colors={{ scheme: "red_blue" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          format: "%b %d",
          // tickValues: "every 4 weeks",
          legend: "Auction End Date",
          legendPosition: "middle",
          legendOffset: 50,
        }}
        axisLeft={{
          format: "$.0f",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Bid Value",
          legendPosition: "middle",
          legendOffset: -70,
        }}
        tooltip={({ node }) => {
          const nodeDate = new Date(node.formattedX);
          const datePlusOneDay = nodeDate.setDate(nodeDate.getDate() + 1);
          const date = new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
          }).format(new Date(datePlusOneDay));
          return (
            <div
              style={{
                color: "white",
                background: "#333",
                padding: "12px 16px",
              }}
            >
              <strong>{node.data.name}</strong>
              <br />
              {`Date: ${date}`}
              <br />
              {`Bid Value: ${node.formattedY}`}
            </div>
          );
        }}
      />
    ) : (
      <Spinner />
    )}
  </Box>
);

export default ScatterPlot;
