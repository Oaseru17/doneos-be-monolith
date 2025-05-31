import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import LOG from "../../library/logging";
import { formatUptime } from '../../utils/timeUtils';

@injectable()
export class HealthController {

  constructor(
  ) {}

  public healthCheck = async (req: Request, res: Response): Promise<void> => {
    const uptimeSeconds = process.uptime();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptimeSeconds),
      uptimeSeconds // Keep the raw seconds for precise calculations if needed
    });
  };

  public readinessCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: "UP",
        reasons: ["Service is ready"]
      });
    } catch (err:any) {
      LOG.error(err);
      res.status(500).json({
        status: "DOWN",
        reasons: [err.message]
      });
    }
  };

}