import { NextApiRequest, NextApiResponse } from "next";
import { Car, TQuery } from "../../local_api/scrape";
import client from "../../lib/mongodb";

type Response = {
  cars: Car[];
  totalPages: number;
  totalResults: number;
};

const LIMIT = 50;

export const getAuctions = async (query: TQuery): Promise<Response> => {
  await client.connect();

  const database = client.db("cars-and-bids");
  const auctionsColl = database.collection("auctions");

  const limit = query.limit ? Math.abs(Number(query.limit)) : LIMIT;

  const auctions = await auctionsColl
    .find<Car>({
      modelYear: {
        $gte: Number(query.start_year),
        $lte: Number(query.end_year),
      },
    })
    .toArray();

  const filteredAuctions = auctions.slice(0, limit);

  return {
    cars: filteredAuctions,
    totalPages: Math.ceil(auctions.length / LIMIT),
    totalResults: auctions.length,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { cars, totalPages, totalResults } = await getAuctions(req.query);

  return res.status(200).json({
    cars,
    totalPages,
    totalResults,
  });
}
