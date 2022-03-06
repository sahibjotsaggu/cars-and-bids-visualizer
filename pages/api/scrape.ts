import chromium from "chrome-aws-lambda";
// import puppeteer from "puppeteer";
import type { NextApiRequest, NextApiResponse } from "next";

type CarsAndBidsAuction = {
  title: string;
  auction_end: string;
  current_bid: number;
};

export type Car = {
  name: string | null;
  endDate: string;
  bidValue: number;
};

type Response = {
  cars: Car[];
};

type MapKeyString = {
  [key: string]: number;
};

const trannyMap = {
  automatic: 1,
  manual: 2,
} as MapKeyString;

const bodyStyleMap = {
  coupe: 1,
  convertible: 2,
  hatchback: 3,
  sedan: 4,
  "suv/crossover": 5,
  truck: 6,
  "van/minivan": 7,
  wagon: 8,
} as MapKeyString;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { query } = req;
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://carsandbids.com/past-auctions/?start_year=${
      query.start_year
    }&end_year=${query.end_year}${
      query.transmission !== "all"
        ? "&transmission=" + trannyMap[query.transmission as string]
        : ""
    }${
      query.bodyStyle !== "all"
        ? "&body_style=" + bodyStyleMap[query.bodyStyle as string]
        : ""
    }`
  );

  const apiAuctionResponse = await page.waitForResponse(
    (response) =>
      response.url().startsWith("https://carsandbids.com/v2/autos/auctions") &&
      response.status() === 200
  );

  const auctions = (await apiAuctionResponse.json()).auctions.map(
    (auction: CarsAndBidsAuction) => {
      const auctionEndDate = new Date(auction.auction_end);
      return {
        name: auction.title,
        endDate: `${auctionEndDate.getUTCFullYear()}-${
          auctionEndDate.getUTCMonth() + 1
        }-${auctionEndDate.getUTCDate() + 1}`, // + 1 on getUTCDate because graph plots in local time
        bidValue: auction.current_bid,
      };
    }
  );

  await browser.close();

  return res.status(200).json({
    cars: auctions,
  });
}
