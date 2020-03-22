module.exports = fixturizePath;

const fixturizeCommitSha = require("./fixturize-commit-sha");
const fixturizeEntityId = require("./fixturize-entity-id");
const temporaryRepository = require("./temporary-repository");

const PLACEHOLDER_REGEX = /\{[^}]+\}/g;
const PATH_TEMPLATES = [
  "/cards/{project-card}",
  "/columns/{project-column}",
  "/commit/{commit-sha}",
  "/commits/{commit-sha}",
  "/git/trees/{commit-sha}",
  "/projects/{project}",
  "/releases/{release}",
  "/releases/assets/{release-asset}",
  "/repositories/{repository}",
  "/repository_invitations/{invitation}",
  "/statuses/{commit-sha}",
  "/teams/{team}",
  "/u/{owner}",
];
// sha hashes are always 40 characters long and can contain numbers or letters
// IDs are always numeric. We check for a sha hash first, then fallback to numeric id
const FIND_SHA_OR_ID_REGEX_STRING = "(\\w{40}|\\d+)";

function fixturizePath(scenarioState, path) {
  // rename temporary repositories
  // e.g. tmp-scenario-bar-20170924033013835 => bar
  path = path.replace(temporaryRepository.regex, "$1");

  const pathTemplate = PATH_TEMPLATES.find((pathTemplate) => {
    const regexString = pathTemplate.replace(
      PLACEHOLDER_REGEX,
      FIND_SHA_OR_ID_REGEX_STRING
    );
    return new RegExp(regexString).test(path);
  });

  if (!pathTemplate) {
    return path;
  }

  const regex = new RegExp(
    pathTemplate.replace(PLACEHOLDER_REGEX, FIND_SHA_OR_ID_REGEX_STRING)
  );
  const placeholderNames = pathTemplate.match(PLACEHOLDER_REGEX);
  const idsOrShas = path.match(regex).slice(1);

  const newPath = placeholderNames.reduce((pathTemplate, placeholder, i) => {
    const entityName = toEntityName(placeholder);

    if (entityName === "commit-sha") {
      return pathTemplate.replace(
        placeholder,
        fixturizeCommitSha(scenarioState.commitSha, idsOrShas[i])
      );
    }

    return pathTemplate.replace(
      placeholder,
      fixturizeEntityId(scenarioState.ids, entityName, idsOrShas[i])
    );
  }, pathTemplate);

  return (
    path
      .replace(regex, newPath)
      // ?u=[sha] query parameter
      .replace(/\?u=\w{40}/, "?u=0000000000000000000000000000000000000001")
  );
}

function toEntityName(placeholder) {
  return placeholder.replace(/[{}]/g, "");
}
