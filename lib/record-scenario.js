export default recordScenario;

import nock from "nock";
const { recorder, restore } = nock;
import removeCredentials from "./remove-credentials.js";

async function recordScenario({ request, scenario }) {
  recorder.rec({
    output_objects: true,
    dont_print: true,
    enable_reqheaders_recording: true,
  });

  if (Array.isArray(scenario)) {
    // if scenario is an array of request options, send requests sequentially
    await scenario.reduce(async (promise, step) => {
      let response;

      try {
        response = await promise;
      } catch (error) {
        // don’t fail on 4xx errors, they are valid fixtures
        if (error.response.status >= 500) {
          throw error;
        }

        response = error.response;
      }

      if (typeof step === "function") {
        return request(step(response));
      }

      return request(step);
    }, Promise.resolve());
  } else if (typeof scenario === "object") {
    // if scenario is an object with request options, send a request for it
    await request(scenario);
  } else {
    // otherwise we expect scenario to be an asynchronous function
    await scenario({ request });
  }

  const fixtures = recorder.play();

  recorder.clear();
  restore();

  return fixtures.map(removeCredentials).map((fixture) => {
    fixture.method = fixture.method.toLowerCase();
    return fixture;
  });
}
