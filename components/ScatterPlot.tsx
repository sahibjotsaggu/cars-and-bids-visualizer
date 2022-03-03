import { ResponsiveScatterPlot, ScatterPlotDatum } from "@nivo/scatterplot";

interface ScatterPlotProps {
  data: ScatterPlotDatum[];
}

const ScatterPlot = ({ data }: ScatterPlotProps) => (
  <ResponsiveScatterPlot
    data={[
      {
        id: "snaek",
        data,
      },
    ]}
    margin={{ top: 20, right: 0, bottom: 70, left: 80 }}
    xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
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
      tickValues: "every 4 weeks",
      legend: "Date",
      legendPosition: "middle",
      legendOffset: 50,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Bid Value",
      legendPosition: "middle",
      legendOffset: -70,
    }}
    tooltip={({ node }) => {
      return (
        <div
          style={{
            color: "white",
            background: "#333",
            padding: "12px 16px",
          }}
        >
          {/* @ts-expect-error */}
          <strong>{node.data.name}</strong>
          <br />
          {`Date: ${node.formattedX}`}
          <br />
          {`Bid Value: ${node.formattedY}`}
        </div>
      );
    }}
  />
);

export default ScatterPlot;
