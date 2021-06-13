import temporaryRepository, { regex } from "../../lib/temporary-repository.js";

test("temporaryRepository(name) returns {create, delete} API", () => {
  const options = {};
  const api = temporaryRepository(options);

  expect(api.create).toBeInstanceOf(Function);
  expect(api.delete).toBeInstanceOf(Function);
});

test("temporaryRepository(name) returns {name}", () => {
  const options = {
    name: "foo-bar",
  };
  const api = temporaryRepository(options);

  expect(api.name).toMatch(regex);
  //  `"${api.name}" matches tmp repository name regex`
});

test("temporaryRepository.regex", () => {
  const { name } = temporaryRepository({ name: "funky-repo" });
  const [, originalName] = name.match(regex);
  expect(originalName).toBe("funky-repo");
  expect(`/repos/org-foo/${name}`.replace(regex, "$1")).toBe(
    "/repos/org-foo/funky-repo"
  );
});

test("temporaryRepository(name).create() sends POST /orgs/octokit-fixture-org/repos request", () => {
  expect.assertions(4);

  const options = {
    name: "repo-bar",
    token: "token123",
    org: "org-foo",
    request(options) {
      expect(options.method).toBe("post");
      expect(options.url).toBe("/orgs/org-foo/repos");
      expect(options.headers.Authorization).toBe("token token123");
      expect(options.data.name).toBe(api.name);
      return Promise.resolve();
    },
  };
  const api = temporaryRepository(options);
  api.create();
});

test("temporaryRepository(name).delete() sends DELETE `/repos/octokit-fixture-org/<tmp name> request", () => {
  expect.assertions(3);

  const options = {
    name: "repo-bar",
    token: "token123",
    org: "org-foo",
    request(options) {
      expect(options.method).toBe("delete");
      expect(options.url).toBe(`/repos/org-foo/${api.name}`);
      expect(options.headers.Authorization).toBe("token token123");
    },
  };
  const api = temporaryRepository(options);
  api.delete();
});
