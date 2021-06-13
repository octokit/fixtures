export default gitRefs;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function gitRefs(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "git-refs",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/repos/contents/#create-a-file
    // (these requests get ignored, we need two commits to test our refrences)
    const {
      data: {
        commit: { sha: sha1 },
      },
    } = await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/contents/1.md`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        message: "initial commit",
        content: Buffer.from(
          "# git-refs\ncreated with initial commit"
        ).toString("base64"),
      },
    });
    const {
      data: {
        commit: { sha: sha2 },
      },
    } = await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/contents/2.md`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        message: "2nd commit",
        content: Buffer.from("# git-refs\ncreated with 2nd commit").toString(
          "base64"
        ),
      },
    });

    // https://developer.github.com/v3/git/refs/#get-all-references
    // returns a single reference for the master branch, pointing to sha of 2nd commit
    await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/git/refs/`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/git/refs/#create-a-reference
    // Create a new branch "test" pointing to sha of initial commit
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/git/refs`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        ref: "refs/heads/test",
        sha: sha1,
      },
    });

    // https://developer.github.com/v3/git/refs/#update-a-reference
    // update test branch to point to sha of 2nd commit instead
    await state.request({
      method: "patch",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/git/refs/heads/test`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        sha: sha2,
      },
    });

    // https://developer.github.com/v3/git/refs/#get-all-references
    // Now returns both branches: master & test
    await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/git/refs/`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/git/refs/#delete-a-reference
    // Delete test branch
    await state.request({
      method: "delete",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/git/refs/heads/test`,
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
