import type { Request, Response } from "express";
import { prisma } from "../config/db.ts";

export const redirectHandler = async (req: Request, res: Response) => {
  try {
    const shortCode = req.params.shortCode;

    if (!shortCode || shortCode.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Bad request, please check the url",
      });
    }

    const urlData = await prisma.shortURL.findFirst({
      where: {
        shortcode: shortCode,
      },
    });

    if (!urlData?.longurl || urlData?.longurl.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Bad request, please check the url",
      });
    }

    res.redirect(301, urlData?.longurl);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error, please check the url",
    });
  }
};
