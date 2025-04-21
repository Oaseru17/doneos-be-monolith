import { Request, Response, NextFunction } from "express";
import LOG from "../../library/logging";

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  let requestHeader: string;
  let sharedSecrets: string;

  requestHeader = String(req.headers["x-reliance-authorization"]);

  sharedSecrets = process.env.SHARED_SECRETS || "";
  const SECRETS = JSON.parse(sharedSecrets);

  if (SECRETS.indexOf(requestHeader) >= 0) {
    LOG.debug("REQUEST WAS AUTHORISED");
    next();
  } else {
    LOG.warn("Unauthorized request received");
    res.status(403).json({ error: "Missing or incorrect x-reliance-authorization header" });
  }
};
