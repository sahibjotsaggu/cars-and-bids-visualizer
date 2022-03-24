import { NextApiRequest, NextApiResponse } from "next";
import { scrapePage, startBrowser } from "./scrape";
import client from "../lib/mongodb";

import { getTotalAuctions } from "./getTotalAuctions";

type Response = {
  auctionsAdded: number;
};

/**
 *
 * ?syncAll=1: sync all auctions
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { query, method } = req;

  await client.connect();

  if (query.syncAll === "1" && method === "POST") {
    const database = client.db("cars-and-bids");
    const auctions = database.collection("auctions");

    const { page, browser } = await startBrowser();

    const totalAuctions = await getTotalAuctions();
    const totalPages = Math.ceil(totalAuctions / 50);

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const { auctions: allAuctions } = await scrapePage({}, page, pageNumber);

      await auctions.insertMany(
        allAuctions.map((a) => {
          const firstToken = a.name.split(" ")[0];
          const modelYear = /^\d+$/.test(firstToken) ? Number(firstToken) : 0;
          return {
            ...a,
            modelYear,
            endDate: a.endDate,
          };
        })
      );
      console.log(`Done scraping page ${pageNumber}`);
    }

    await browser.close();
  }

  return res.status(200).json({
    auctionsAdded: 0, // TODO
  });
}
