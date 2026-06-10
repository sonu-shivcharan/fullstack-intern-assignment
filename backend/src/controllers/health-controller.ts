import os from "os";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";

const cpuAverage = () => {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  if (!cpus || cpus.length === 0) {
    return { idle: 0, total: 0 };
  }
  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalMs += (cpu.times as any)[type];
    }
    idleMs += cpu.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
};

const getCpuUsage = (): Promise<number> => {
  return new Promise((resolve) => {
    const startMeasure = cpuAverage();
    setTimeout(() => {
      const endMeasure = cpuAverage();
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      if (totalDifference === 0) {
        resolve(0);
        return;
      }
      const percentageCPU = 100 - Math.round((100 * idleDifference) / totalDifference);
      resolve(percentageCPU);
    }, 100);
  });
};

export const getHealthStatus = asyncHandler(async (req, res) => {
  // 1. Calculate CPU usage
  const cpuPercent = await getCpuUsage();

  // 2. Check Database connection
  let dbStatus = "connected";
  let dbLatencyMs: number | undefined;
  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - dbStart;
  } catch (error: any) {
    dbStatus = `disconnected: ${error?.message || error}`;
  }

  // 3. System details
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  const healthData = {
    status: dbStatus === "connected" ? "healthy" : "degraded",
    uptimeInSeconds: uptime,
    cpuUsage: {
      percentage: cpuPercent,
      cores: os.cpus().length,
    },
    db: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    memory: {
      process: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      },
      system: {
        free: `${Math.round(os.freemem() / 1024 / 1024 * 100) / 100} MB`,
        total: `${Math.round(os.totalmem() / 1024 / 1024 * 100) / 100} MB`,
      },
    },
    timestamp: new Date().toISOString(),
  };

  const statusCode = dbStatus === "connected" ? 200 : 500;
  return res.status(statusCode).json(
    new ApiResponse(healthData, "Health status fetched successfully", statusCode)
  );
});
