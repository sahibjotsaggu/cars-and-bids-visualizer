import puppeteer from "puppeteer";

import type { NextApiRequest, NextApiResponse } from "next";

type Car = {
  name: string | null;
};

type Response = {
  cars: Car[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  console.log("I have been summoned...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://carsandbids.com/past-auctions/");
  await page.waitForSelector(".auction-item");
  const cars = await page.$$eval(".auction-title a", (nodes) =>
    nodes.map((node) => ({
      name: node.textContent,
    }))
  );
  // const carImages = await page.$$eval(".auction-item img", (nodes) =>
  //   nodes.map((node) => node.getAttribute("src"))
  // );
  // console.log(carImages);

  return res.status(200).json({
    cars,
  });
}
