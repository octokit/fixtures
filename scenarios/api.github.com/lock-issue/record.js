export default lockIssue;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function lockIssue(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "lock-issue",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/issues/#create-an-issue
    // (this request gets ignored, we need an existing issue that we can lock)
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        title: "Issue without a label",
      },
    });

    // https://developer.github.com/v3/issues/#lock-an-issue
    await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues/1/lock`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/issues/#unlock-an-issue
    await state.request({
      method: "delete",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues/1/lock`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });
  } catch (_error) {
    error = _error;
  }

  await temporaryRepository.delete();

  if (error) {
    return Promise.reject(error);
  }
}
