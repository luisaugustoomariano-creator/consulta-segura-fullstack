import { authorizedApiProvider } from "./authorizedApiProvider";
import { simulatedProvider } from "./simulatedProvider";
import { DataProvider } from "./types";
import { env } from "../config/env";

export function getDataProvider(): DataProvider {
  if (env.DATA_PROVIDER_MODE === "authorized_api") {
    return authorizedApiProvider;
  }

  return simulatedProvider;
}
