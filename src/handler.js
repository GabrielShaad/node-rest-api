import { fileURLToPath, parse } from "node:url";
import { DEFAULT_HEADER } from "./util/util.js";
import { routes } from "./routes/heroRoute.js";
import { dirname, join } from "node:path";
import { generateInstance } from "./factories/heroFactory.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const filePath = join(currentDir, "./../database", "data.json");

const heroService = generateInstance({ filePath });

const heroRoutes = routes({ heroService });

const allRoutes = {
  ...heroRoutes,
  default: (resquest, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write("Wooooops, not found!");
    response.end();
  },
};

function handler(request, response) {
  const { url, method } = request;

  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] || allRoutes.default;

  return Promise.resolve(chosen(request, response)).catch(
    handleError(response)
  );
}

function handleError(response) {
  return (error) => {
    console.error("Something bad has happened!", error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internal Server Error" }));

    return response.end();
  };
}

export default handler;
