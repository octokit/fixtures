export default getArchive;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function getArchive(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "get-archive",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/repos/contents/#create-a-file
    // (this request gets ignored, we need an existing content to download it)
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
        content: Buffer.from("# get-archive").toString("base64"),
      },
    });

    // https://developer.github.com/v3/repos/contents/#get-archive-link
    // Download repository as archive. state.request throws error for a
    // 3xx response so we have to catch that
    try {
      await state.request({
        method: "get",
        url: `/repos/octokit-fixture-org/${temporaryRepository.name}/tarball/main`,
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        },
      });
    } catch (error) {
      const { headers } = error.response;

      await state.request({
        method: "get",
        url: headers.location,
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        },
      });
    }
  } catch (_error) {
    error = _error;
  }

  await temporaryRepository.delete();

  if (error) {
    return Promise.reject(error);
  }
}
