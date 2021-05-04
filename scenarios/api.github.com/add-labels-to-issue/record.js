export default addAndRemoveRepostioryCollaborator;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

// - create issue
// - add labels to issue
async function addAndRemoveRepostioryCollaborator(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "add-labels-to-issue",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/issues/#create-an-issue
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        title: "Issue without a label",
      },
    });

    // https://developer.github.com/v3/issues/labels/#add-labels-to-an-issue
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues/1/labels`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        labels: ["Foo", "bAr", "baZ"],
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
