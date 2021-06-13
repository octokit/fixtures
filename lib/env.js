import { cleanEnv, str } from "envalid";

export default cleanEnv(process.env, {
  FIXTURES_USER_A_TOKEN_FULL_ACCESS: str(),
  FIXTURES_USER_B_TOKEN_FULL_ACCESS: str(),
});
