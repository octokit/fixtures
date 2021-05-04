export default markNotificationsAsRead;
import env from "../../../lib/env.js";

// https://developer.github.com/v3/activity/notifications/#mark-as-read
async function markNotificationsAsRead(state) {
  await state.request({
    method: "put",
    url: "/notifications",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  });
}
