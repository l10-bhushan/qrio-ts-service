import type { Request, Response } from "express";

const fetchAllShortURLs = (req: Request, res: Response) => {
  const userId = req.user?.userId;

  res.status(200).json({
    status: "success",
    data: {
      userId,
    },
  });
};

const generateShortURL = (_req: Request, _res: Response) => {
  console.log("Short URL controller");
};

const deleteShortURL = (_req: Request, _res: Response) => {
  console.log("Delete short URL");
};

const updateShortURL = (_req: Request, _res: Response) => {
  console.log("Update short url");
};

export { generateShortURL, fetchAllShortURLs, deleteShortURL, updateShortURL };
