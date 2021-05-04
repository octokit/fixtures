import axios from "axios";

import fixtures from "../../../index.js";

test("Get repository", async () => {
  const mock = fixtures.mock(
    "api.github.com/add-and-remove-repository-collaborator"
  );

  // https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
  await axios({
    method: "put",
    url: "https://api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Length": 0,
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/invitations/
  const invitationsResponse = await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/invitations",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(invitationsResponse.data[0].id).toBe(1000);

  // https://developer.github.com/v3/repos/invitations/#accept-a-repository-invitation
  await axios({
    method: "patch",
    url: "https://api.github.com/user/repository_invitations/1000",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000002",
      "Content-Length": 0,
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/collaborators/#remove-user-as-a-collaborator
  await axios({
    method: "delete",
    url: "https://api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators/octokit-fixture-user-b",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/add-and-remove-repository-collaborator/collaborators",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
