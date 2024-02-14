import test from "node:test";
import assert from "node:assert";
import { routes } from "../../src/routes/heroRoute.js";

const callTracker = new assert.CallTracker();

process.on("exit", () => callTracker.verify());

test("Hero Routes Unit Tests", async (t) => {
  await t.test("it should test the route GET /heroes", async (t) => {
    const databaseMock = [
      {
        id: "cc5d29b3-5488-42cf-a562-ecbb01a7fed7",
        name: "Batman",
        age: 40,
        power: "Rich",
      },
    ];

    const heroServiceStub = {
      find: async () => databaseMock,
    };

    const endpoints = routes({
      heroService: heroServiceStub,
    });

    const endpoint = "/heroes:get";
    const request = {};
    const response = {
      write: callTracker.calls((item) => {
        const expected = JSON.stringify({ results: databaseMock });
        assert.strictEqual(
          item,
          expected,
          "write should be called with expected value"
        );
      }),
      end: callTracker.calls((item) => {
        assert.strictEqual(
          item,
          undefined,
          "end should be called without arguments"
        );
      }),
    };

    const route = endpoints[endpoint];
    await route(request, response);
  });
});
