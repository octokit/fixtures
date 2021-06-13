export default addAndRemoveRepostioryCollaborator;

import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

// - As user A, invite user B as collaborator to repository "octokit-fixture-org/hello-world"
// - As user A, list invitations
// - As user B, accept invitation
// - As user A, list collaborators (now includes user B)
// - As user A, remove user B as collaborator from repository
// - As user A, list collaborators (no longer includes user B)
async function addAndRemoveRepostioryCollaborator(state) {
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "add-and-remove-repository-collaborator",
  });

  await temporaryRepository.create();

  // https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
  await state.request({
    method: "put",
    url: `/repos/octokit-fixture-org/${temporaryRepository.name}/collaborators/octokit-fixture-user-b`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  });

  // https://developer.github.com/v3/repos/invitations/
  const invitationsResponse = await state.request({
    method: "get",
    url: `/repos/octokit-fixture-org/${temporaryRepository.name}/invitations`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  });

  // https://developer.github.com/v3/repos/invitations/#accept-a-repository-invitation
  await state.request({
    method: "patch",
    url: `/user/repository_invitations/${invitationsResponse.data[0].id}`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_B_TOKEN_FULL_ACCESS}`,
    },
  });

  // wait for 1000ms as there seems to be a race condition on GitHub’s API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  await state.request({
    method: "get",
    url: `/repos/octokit-fixture-org/${temporaryRepository.name}/collaborators`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  });

  // https://developer.github.com/v3/repos/collaborators/#remove-user-as-a-collaborator
  await state.request({
    method: "delete",
    url: `/repos/octokit-fixture-org/${temporaryRepository.name}/collaborators/octokit-fixture-user-b`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  });

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  await state.request({
    method: "get",
    url: `/repos/octokit-fixture-org/${temporaryRepository.name}/collaborators`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  });

  await temporaryRepository.delete();
}
