export default branchProtection;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function branchProtection(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "branch-protection",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/repos/contents/#create-a-file
    // (this request does not get recorded, we need an existing commit to set status on)
    await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/contents/README.md`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        message: "initial commit",
        content: Buffer.from("# branch-protection").toString("base64"),
      },
    });

    // https://developer.github.com/v3/orgs/teams/#add-or-update-team-repository
    // (this request does not get recorded, the team must be added to the
    // repository in order for it to be add to branch restrictions)
    // 2527061 is the ID of https://github.com/orgs/octokit-fixture-org/teams/a-team
    await state.request({
      method: "put",
      url: `/teams/2527061/repos/octokit-fixture-org/${temporaryRepository.name}`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        permission: "push",
      },
    });

    // https://developer.github.com/v3/repos/branches/#get-branch-protection
    // Get branch protection
    await state
      .request({
        method: "get",
        url: `/repos/octokit-fixture-org/${temporaryRepository.name}/branches/main/protection`,
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        },
      })
      .catch((error) => {
        if (error.response.data.message === "Branch not protected") {
          return; // this 404 is expected
        }

        throw error;
      });

    // https://developer.github.com/v3/repos/branches/#update-branch-protection
    // Update branch protection with minimal settings
    await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/branches/main/protection`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        required_status_checks: null,
        required_pull_request_reviews: null,
        restrictions: null,
        enforce_admins: false,
      },
    });

    // https://developer.github.com/v3/repos/branches/#update-branch-protection
    // Update branch protection with maximal settings
    await state.request({
      method: "put",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/branches/main/protection`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        required_status_checks: {
          strict: true,
          contexts: ["foo/bar"],
        },
        required_pull_request_reviews: {
          dismissal_restrictions: {
            users: ["octokit-fixture-user-a"],
            teams: [], // bug: server returns "Only 100 users and teams can be specified." when set to ['a-team']
          },
          dismiss_stale_reviews: true,
          require_code_owner_reviews: false,
        },
        restrictions: {
          users: ["octokit-fixture-user-a"],
          teams: ["a-team"],
        },
        enforce_admins: true,
      },
    });

    // https://developer.github.com/v3/repos/branches/#remove-branch-protection
    // Remove branch protection
    await state.request({
      method: "delete",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/branches/main/protection`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });
  } catch (_error) {
    error = _error;
  }

  // await temporaryRepository.delete();

  if (error) {
    return Promise.reject(error);
  }
}
