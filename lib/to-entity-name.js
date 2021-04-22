export default toEntityName;

function toEntityName(object, fixture) {
  // object is binary response, so we check for it above the object check
  if (/\/legacy\.(tar\.gz|zip)\/refs\/heads\/main$/.test(fixture.path)) {
    return "archive";
  }

  if (typeof object !== "object") {
    return;
  }

  if (object.type === "Organization") {
    return "organization";
  }
  if ("forks" in object) {
    return "repository";
  }
  if (/\/repositories\/\d+$/.test(object.url)) {
    return "repository";
  }
  if ("invitee" in object && "inviter" in object) {
    return "invitation";
  }
  if ("number" in object && /\/issues\/\d+$/.test(object.url)) {
    return "issue";
  }
  if ("color" in object && /\/labels\//.test(object.url)) {
    return "label";
  }
  if ("content" in object && "commit" in object) {
    return "file-change";
  }
  if (/\/statuses\/[0-9a-f]{40}$/.test(object.url)) {
    return "status";
  }
  if (/\/commits\/[0-9a-f]{40}\/status$/.test(object.url)) {
    return "combined-status";
  }
  if ("ref" in object) {
    return "reference";
  }
  if (/\/protection$/.test(object.url)) {
    return "branch-protection";
  }
  if ("prerelease" in object) {
    return "release";
  }
  if (/\/releases\/assets\/\d+$/.test(object.url)) {
    return "release-asset";
  }
  if (/\/projects\/columns\/cards\/\d+$/.test(object.url)) {
    return "project-card";
  }
  if (/\/projects\/columns\/cards\/\d+\/moves$/.test(fixture.path)) {
    return "project-card-move";
  }
  if (/^\/search\/issues\?/.test(fixture.path)) {
    return "search-issues";
  }

  if ("errors" in object) {
    return "error";
  }
}
