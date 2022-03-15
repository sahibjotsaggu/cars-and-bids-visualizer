import { NextApiRequest, NextApiResponse } from "next";
import { Car, scrapePage, setupDB, startBrowser } from "./scrape";

import { getTotalAuctions } from "./getTotalAuctions";

type Response = {
  auctionsAdded: number;
};

/**
 *
 * ?syncAll=1: sync all auctions - rewrite entire DB
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { query } = req;

  if (query.syncAll === "1") {
    // sync all auctions
    const db = setupDB();

    db.data ||= {
      auctions: [],
    };

    const { page, browser } = await startBrowser();

    let allAuctions: Car[] = [];

    const totalAuctions = await getTotalAuctions();
    const totalPages = Math.ceil(totalAuctions / 50);

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const { auctions } = await scrapePage({}, page, pageNumber);

      allAuctions = allAuctions.concat(auctions);
      console.log(`Done scraping page ${pageNumber}`);
    }

    await browser.close();

    db.data.auctions = allAuctions;
    await db.write();
  } else {
  }

  return res.status(200).json({
    auctionsAdded: 0, // TODO
  });
}
