export default searchIssues;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function searchIssues(state) {
  let error;

  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "search-issues",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/issues/#create-an-issue
    // (theses requests get ignored, we need an existing issues for the serarch)
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        title: "The doors don’t open",
        body: 'I tried "open sesame" as seen on Wikipedia but no luck!',
      },
    });

    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_B_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        title: "Sesame seeds split without a pop!",
        body: "I’ve waited all year long, but there was no pop 😭",
      },
    });

    // timeout for search indexing
    await new Promise((resolve) => setTimeout(resolve, 15000));

    const query = `sesame repo:octokit-fixture-org/${temporaryRepository.name}`;
    await state.request({
      method: "get",
      url: `/search/issues?q=${encodeURIComponent(query)}`,
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
