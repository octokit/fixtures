import setIfExists from "../../lib/set-if-exists";

test("setIfExists accepts undefined as object argument", () => {
  const result = setIfExists(undefined, "foo", "bar");
  expect(result).toBe(undefined);
});

test("setIfExists sets nested valuest", () => {
  const object = {
    foo: {
      bar: "baz",
    },
  };
  setIfExists(object, "foo.bar", "qux");
  expect(object.foo.bar).toBe("qux");
});
