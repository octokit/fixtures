export default lockIssue;
import env from "../../../lib/env.js";
import getTemporaryRepository from "../../../lib/temporary-repository.js";

async function lockIssue(state) {
  let error;
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: "octokit-fixture-org",
    name: "prooject-cards",
  });

  await temporaryRepository.create();

  try {
    // https://developer.github.com/v3/projects/#create-a-repository-project
    // (this request gets ignored, we need an existing project to create cards in)
    const {
      data: { id: projectId },
    } = await state.request({
      method: "post",
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}/projects`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        name: "Example project",
      },
    });

    // https://developer.github.com/v3/projects/columns/#create-a-project-column
    // (this request gets ignored, we need an existing columns to create cards in and move to)
    const {
      data: { id: column1Id },
    } = await state.request({
      method: "post",
      url: `/projects/${projectId}/columns`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        name: "Example column 1",
      },
    });
    const {
      data: { id: column2Id },
    } = await state.request({
      method: "post",
      url: `/projects/${projectId}/columns`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
        "X-Octokit-Fixture-Ignore": "true",
      },
      data: {
        name: "Example column 2",
      },
    });

    // Creating a card assigned to an issue is currently broken, so we skip it for now
    // // https://developer.github.com/v3/issues/#create-an-issue
    // // (this request gets ignored, we need an existing issue that we can assign a card to)
    // const {data: {id: issueId}} = await state.request({
    //   method: 'post',
    //   url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues`,
    //   headers: {
    //     Accept: 'application/vnd.github.v3+json',
    //     Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    //     'X-Octokit-Fixture-Ignore': 'true'
    //   },
    //   data: {
    //     title: 'Example issue for card'
    //   }
    // })

    // https://developer.github.com/v3/projects/cards/#create-a-project-card
    const {
      data: { id: card1Id },
    } = await state.request({
      method: "post",
      url: `/projects/columns/${column1Id}/cards`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        note: "Example card 1",
      },
    });

    const {
      data: { id: card2Id },
    } = await state.request({
      method: "post",
      url: `/projects/columns/${column1Id}/cards`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        note: "Example card 2",
      },
    });

    // see above, creating a card assigned to an issue via API is currently broken
    // const {data: {id: card2}} = await state.request({
    //   method: 'post',
    //   url: `/projects/columns/${column1Id}/cards`,
    //   headers: {
    //     Accept: "application/vnd.github.v3+json",
    //     Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
    //   },
    //   data: {
    //     content_id: issueId,
    //     content_type: 'issue'
    //   }
    // })

    // https://developer.github.com/v3/projects/cards/#list-project-cards
    await state.request({
      method: "get",
      url: `/projects/columns/${column1Id}/cards`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/projects/cards/#get-a-project-card
    await state.request({
      method: "get",
      url: `/projects/columns/cards/${card1Id}`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
    });

    // https://developer.github.com/v3/projects/cards/#update-a-project-card
    await state.request({
      method: "patch",
      url: `/projects/columns/cards/${card1Id}`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        note: "Example card 1 updated",
      },
    });

    // https://developer.github.com/v3/projects/cards/#move-a-project-card
    // move 1st card to 2nd column
    await state.request({
      method: "post",
      url: `/projects/columns/cards/${card1Id}/moves`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        position: "top",
        column_id: column2Id,
      },
    });

    // move 2nd card to bottom of 2nd column
    await state.request({
      method: "post",
      url: `/projects/columns/cards/${card2Id}/moves`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        position: "bottom",
        column_id: column2Id,
      },
    });

    // move 1st card below 2nd card
    await state.request({
      method: "post",
      url: `/projects/columns/cards/${card1Id}/moves`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      },
      data: {
        position: `after:${card2Id}`,
      },
    });

    // https://developer.github.com/v3/projects/cards/#delete-a-project-card
    await state.request({
      method: "delete",
      url: `/projects/columns/cards/${card1Id}`,
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
