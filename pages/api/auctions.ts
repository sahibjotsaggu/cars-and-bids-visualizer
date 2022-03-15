import { NextApiRequest, NextApiResponse } from "next";
import { Car, setupDB, TQuery } from "./scrape";

type Response = {
  cars: Car[];
  page: number;
  total: number;
};

export const getAuctions = async (query: TQuery): Promise<Response> => {
  const db = setupDB();
  await db.read();

  db.data ||= { auctions: [] };

  const offset = query.offset ? Math.abs(Number(query.offset)) : 0;
  const limit = query.limit ? Math.abs(Number(query.limit)) : 50;

  let filteredAuctions: Car[] = [];
  let filteredAuctionsTotal = 0;

  if (db.data.auctions.length) {
    filteredAuctions = db.data.auctions.filter((auction) => {
      // auction modelYear is between query.start_year and query.end_year
      return (
        auction.modelYear >= Number(query.start_year) &&
        auction.modelYear <= Number(query.end_year)
      );
    });
    filteredAuctionsTotal = filteredAuctions.length;
    filteredAuctions = filteredAuctions.slice(offset, offset + limit);
  }

  return {
    cars: filteredAuctions,
    page: Number(query.page),
    total: filteredAuctionsTotal,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { cars, page, total } = await getAuctions(req.query);

  return res.status(200).json({
    cars,
    page,
    total,
  });
}
