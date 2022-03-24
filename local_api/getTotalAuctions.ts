import { NextApiRequest, NextApiResponse } from "next";
import { startBrowser } from "./scrape";

type Response = {
  total: number;
};

export const getTotalAuctions = async (): Promise<number> => {
  const { browser, page } = await startBrowser();

  await page.goto("https://carsandbids.com/past-auctions");

  const apiAuctionResponse = await page.waitForResponse(
    (response) =>
      response.url().startsWith("https://carsandbids.com/v2/autos/auctions") &&
      response.status() === 200
  );

  const auctionJson = await apiAuctionResponse.json();

  await browser.close();

  return auctionJson.total;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const total = await getTotalAuctions();

  return res.status(200).json({
    total,
  });
}
