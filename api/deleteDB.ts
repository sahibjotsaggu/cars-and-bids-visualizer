import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/mongodb";

type Response = {
  auctionsDeleted: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  await client.connect();

  const database = client.db("cars-and-bids");
  const auctions = database.collection("auctions");
  const result = await auctions.deleteMany({});

  return res.status(200).json({
    auctionsDeleted: result.deletedCount,
  });
}
