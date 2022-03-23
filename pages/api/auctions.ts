import { NextApiRequest, NextApiResponse } from "next";
import { Car, setupDB, TQuery } from "./scrape";
import client from "../../lib/mongodb";

type Response = {
  cars: Car[];
  page: number;
  total: number;
};

export const getAuctions = async (query: TQuery): Promise<Response> => {
  const db = setupDB();
  await db.read();

  await client.connect();

  const database = client.db("cars-and-bids");
  const auctionsColl = database.collection("auctions");

  db.data ||= { auctions: [] };

  const offset = query.offset ? Math.abs(Number(query.offset)) : 0;
  const limit = query.limit ? Math.abs(Number(query.limit)) : 50;

  const auctions = await auctionsColl
    .find<Car>({
      modelYear: {
        $gte: Number(query.start_year),
        $lte: Number(query.end_year),
      },
    })
    .toArray();

  const filteredAuctions = auctions.slice(offset, offset + limit);

  return {
    cars: filteredAuctions,
    page: Number(query.page),
    total: auctions.length,
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
