export default errors;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function errors(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "errors",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/issues/labels/#create-a-label
    // Create a label with invalid payload
    await state
      .request({
        method: "post",
        url: `/repos/octokit-fixture-org/${temporaryRepository.name}/labels`,
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        },
        data: {
          name: "foo",
          color: "invalid",
        },
      })

      // record expected 422 error
      .catch((error) => {
        if (error.response.status !== 422) {
          throw error;
        }
      });
  } catch (_error) {
    error = _error;
  }

  await temporaryRepository.delete();

  if (error) {
    return Promise.reject(error);
  }
}
