export default releaseAssetsConflict;
import { parseTemplate } from "url-template";
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function releaseAssetsConflict(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "release-assets-conflict",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/repos/contents/#create-a-file
    // (this request gets ignored, we need an existing commit before creating a release)
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
        content: Buffer.from("# release-assets-conflict").toString("base64"),
      },
    });

    // https://developer.github.com/v3/repos/releases/#create-a-release
    // (this request gets ignored, it will create our test release)
    await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/releases`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        tag_name: "v1.0.0",
        name: "Version 1.0.0",
        body: "Initial release",
        target_commitish: sha,
      },
    });

    // https://developer.github.com/v3/repos/releases/#create-a-release
    // Get the release. The upload_url from the response must be used for uploads
    const {
      data: { id: releaseId, upload_url: uploadUrl },
    } = await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/releases/tags/v1.0.0`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    const uploadUrlParsed = parseTemplate(uploadUrl).expand({
      name: "test-upload.txt",
      label: "test",
    });

    // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    // upload attachment to release URL returned by create release request
    // Ignore this request as we want to test a conflict
    await state.request({
      method: "post",
      url: uploadUrlParsed,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "Content-Type": "text/plain",
        "Content-Length": 14,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: "Hello, world!\n",
    });

    // Upload again to record the actual conflict
    try {
      await state.request({
        method: "post",
        url: uploadUrlParsed,
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
          "Content-Type": "text/plain",
          "Content-Length": 14,
        },
        data: "Hello, world!\n",
      });
    } catch (error) {
      // API returns 422 status in case of a conflict
      if (error.response.status !== 422) {
        throw error;
      }
    }

    // https://developer.github.com/v3/repos/releases/#list-assets-for-a-release
    // Assuming a library would now want to delete the asset before trying to
    // re-upload again, we need to retrieve the asset lists first to get the
    // id of the existing asset
    const {
      data: [{ id: assetId }],
    } = await state.request({
      method: "get",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/releases/${releaseId}/assets`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/repos/releases/#delete-a-release-asset
    // delete the existing asset
    await state.request({
      method: "delete",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/releases/assets/${assetId}`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // And try to upload again, this time it should work
    await state.request({
      method: "post",
      url: uploadUrlParsed,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "Content-Type": "text/plain",
        "Content-Length": 14,
      },
      data: "Hello, world!\n",
    });
  } catch (_error) {
    error = _error;
  }

  await temporaryRepository.delete();

  if (error) {
    return Promise.reject(error);
  }
}
