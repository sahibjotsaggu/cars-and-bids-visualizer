import { join, dirname } from "path";
import { fileURLToPath } from "url";
import chromium from "chrome-aws-lambda";
import type { NextApiRequest, NextApiResponse } from "next";
import { Low, JSONFile } from "lowdb";
import { Browser, Page } from "puppeteer-core";

type CarsAndBidsAuction = {
  title: string;
  auction_end: string;
  current_bid: number;
};

export type Car = {
  name: string;
  modelYear: number;
  endDate: string;
  bidValue: number;
};

type Response = {
  cars: Car[];
  page: number;
  total: number;
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

type DBData = {
  auctions: Car[];
};

export const setupDB = (): Low<DBData> => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const file = join(__dirname, "db.json");
  const adapter = new JSONFile<DBData>(file);
  return new Low(adapter);
};

export const startBrowser = async () => {
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  return {
    page: await browser.newPage(),
    browser,
  };
};

export type TQuery = {
  [key: string]: string | string[];
};

export const scrapePage = async (query: TQuery, page: Page, pageNumber = 1) => {
  await page.goto(
    `https://carsandbids.com/past-auctions/?start_year=${
      query.start_year || "1981"
    }&end_year=${
      query.end_year || String(new Date().getFullYear())
    }&page=${pageNumber}${
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

  const auctionJson = await apiAuctionResponse.json();

  const totalAuctions = auctionJson.total;

  const auctions = auctionJson.auctions.map((auction: CarsAndBidsAuction) => {
    const auctionEndDate = new Date(auction.auction_end);
    return {
      name: auction.title,
      endDate: `${auctionEndDate.getUTCFullYear()}-${
        auctionEndDate.getUTCMonth() + 1
      }-${auctionEndDate.getUTCDate() + 1}`, // + 1 on getUTCDate because graph plots in local time
      bidValue: auction.current_bid,
    };
  });

  return {
    auctions: auctions as Car[],
    totalAuctions: totalAuctions as number,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { query } = req;

  const db = setupDB();
  await db.read();

  const { page, browser } = await startBrowser();

  const { auctions, totalAuctions } = await scrapePage(
    query,
    page,
    Number(query.page)
  );

  await browser.close();

  db.data ||= { auctions: [] };

  db.data.auctions = auctions;

  await db.write();

  return res.status(200).json({
    cars: auctions,
    page: Number(query.page),
    total: totalAuctions,
  });
}
