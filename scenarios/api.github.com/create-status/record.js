export default createStatus;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function createStatus(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "create-status",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/repos/contents/#create-a-file
    // (this request gets ignored, we need an existing commit to set status on)
    const {
      data: {
        commit: { sha },
      },
    } = await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/contents/README.md`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        message: "initial commit",
        content: Buffer.from("# create-status").toString("base64"),
      },
    });

    // https://developer.github.com/v3/repos/statuses/#create-a-status
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/statuses/${sha}`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        state: "failure",
        target_url: "https://example.com",
        description: "create-status failure test",
        context: "example/1",
      },
    });
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/statuses/${sha}`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        state: "success",
        target_url: "https://example.com",
        description: "create-status success test",
        context: "example/2",
      },
    });

    // Wait for the created data to propagate
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // https://developer.github.com/v3/repos/statuses/#list-statuses-for-a-specific-ref
    await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/commits/${sha}/statuses`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
    await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/commits/${sha}/status`,
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
