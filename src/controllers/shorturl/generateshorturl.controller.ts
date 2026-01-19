import { prisma } from "../../config/db.ts";
import type { Request, Response } from "express";
import { encodeBase62 } from "../../utils/helper.ts";

const fetchAllShortURLs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const allShortUrls = await prisma.shortURL.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        allShortUrls,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const redirectURL = (_req: Request, res: Response) => {};

const generateShortURL = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    // Checking if user is authorized
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    // Checking the type of url and if not empty
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Please enter a valid url" });
    }

    // trimming the url and adding suffix if not present
    let normalizeURL = url.trim();
    if (!/^https?:\/\//i.test(normalizeURL)) {
      normalizeURL = `https://${normalizeURL}`;
    }

    // Checking if URL format is correct after adding prefix
    try {
      new URL(normalizeURL);
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Checking if the URL already present
    const existingData = await prisma.shortURL.findUnique({
      where: {
        longurl: normalizeURL,
        createdBy: req.user.userId,
      },
    });

    // If data present return the data
    if (existingData) {
      return res.status(200).json({
        status: "success",
        data: existingData,
      });
    }

    // Else insert a new entry
    const inserted = await prisma.shortURL.create({
      data: {
        longurl: normalizeURL,
        shortcode: " ",
        noOfVisits: 0,
        user: {
          connect: {
            id: req.user.userId,
          },
        },
      },
    });

    // Generate the obfuscated data from the DB if
    const obfuscated =
      parseInt(inserted.id) * parseInt(process.env.MULTIPLIER!) +
      parseInt(process.env.OFFSET!);

    // Encode the obfuscated ID with base62 to get the shortCode
    const shortCode = encodeBase62(obfuscated);

    // Update the db
    const response = await prisma.shortURL.update({
      where: {
        id: inserted.id,
      },
      data: {
        shortcode: shortCode,
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        ...response,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

const deleteShortURL = async (req: Request, res: Response) => {
  try {
    const { urlId } = req.body;

    const success = await prisma.shortURL.delete({
      where: {
        id: urlId,
      },
    });

    if (success) {
      return res.status(200).json({
        status: "success",
        message: "URL deleted successfully !!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error: URLId does not exist",
    });
  }
};

const updateShortURL = (_req: Request, _res: Response) => {
  console.log("Update short url");
};

export {
  generateShortURL,
  fetchAllShortURLs,
  deleteShortURL,
  updateShortURL,
  redirectURL,
};
