import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    console.error("Validation Error:", err.issues);
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues,
    });
  }

  console.error(err);

  res.status(500).json({
    error: err.message || "Internal server error",
  });
};
