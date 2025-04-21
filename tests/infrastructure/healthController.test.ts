import supertest from "supertest";
import createServer from "../../src/utils/server";
import 'reflect-metadata';
import '../../src/dependencyInjection/container';

const app = createServer();

describe("health", () => {

  describe("health route", () => {
    it("should report the app as healthy", async () => {
      const { body, statusCode } = await supertest(app).get("/health");
      expect(statusCode).toBe(200);
      expect(body).toStrictEqual({
        status: "UP",
        /**
         * since the timestamp on the process and the running of the unit test are different
         * we can't use the process.uptime() method and instead we expect any string to be in property
         *
         * expect string as the toFixed(0) method returns a string
         */
        uptime: expect.any(Number)
      });
    });
  });

  describe("readiness route", () => {
    it("should return a 200 with the down response", async () => {
      const { body, statusCode } = await supertest(app).get("/health/readiness");

      expect(statusCode).toBe(200);
      expect(body).toStrictEqual({
        status: "UP",
        reasons: ["Service is ready"]
      });
    });
  });
});
