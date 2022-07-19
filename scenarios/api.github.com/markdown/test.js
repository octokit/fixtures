import axios from "axios";

import fixtures from "../../../index.js";

test("Get repository", async () => {
  const mock = fixtures.mock("api.github.com/markdown");

  const { data: contextMarkdown } = await axios({
    method: "post",
    url: "https://api.github.com/markdown",
    headers: {
      Accept: "text/html",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      text: `### Hello

b597b5d`,
      context: "octokit-fixture-org/hello-world",
      mode: "gfm",
    },
  }).catch(mock.explain);

  expect(contextMarkdown).toBe(
    '<h3 dir="auto">Hello</h3>\n<p dir="auto"><a class="commit-link" data-hovercard-type="commit" data-hovercard-url="https://github.com/octokit-fixture-org/hello-world/commit/b597b5d6eead8f1a9e9d3243cd70a890a6155ca8/hovercard" href="https://github.com/octokit-fixture-org/hello-world/commit/b597b5d6eead8f1a9e9d3243cd70a890a6155ca8"><tt>b597b5d</tt></a></p>'
  );

  const { data: markdown } = await axios({
    method: "post",
    url: "https://api.github.com/markdown/raw",
    headers: {
      Accept: "text/html",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "text/plain; charset=utf-8",
    },
    data: `### Hello

b597b5d`,
  }).catch(mock.explain);

  expect(markdown).toBe(
    '<h3>\n<a id="user-content-hello" class="anchor" href="#hello" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Hello</h3>\n<p>b597b5d</p>\n'
  );
  expect(mock.done.bind(mock)).not.toThrow();
});
