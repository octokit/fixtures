export default labels;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function labels(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "labels",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/issues/labels/#list-all-labels-for-this-repository
    // List all labels for a repository
    await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/labels`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/issues/labels/#create-a-label
    // Create a label
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/labels`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        name: "test-label",
        color: "663399",
      },
    });

    // https://developer.github.com/v3/issues/labels/#get-a-single-label
    // Get a label
    await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/labels/test-label`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/issues/labels/#get-a-single-label
    // Update a label
    await state.request({
      method: "patch",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/labels/test-label`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        new_name: "test-label-updated",
        color: "BADA55",
      },
    });

    // https://developer.github.com/v3/issues/labels/#delete-a-label
    // Delete a label
    await state.request({
      method: "delete",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/labels/test-label-updated`,
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
