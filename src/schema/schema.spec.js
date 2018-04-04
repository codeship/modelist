import { validateAgainstSchema as validate } from "./schema";

beforeEach(() => {
  console.warn = jest.fn();
});

test("warns if a schema key is not present", () => {
  validate({}, { id: Number });

  expect(console.warn).toBeCalledWith(
    "Entry is missing the defined schema key 'id'",
    {}
  );
});

test("warns if a value is not of correct type", () => {
  validate({ id: "1" }, { id: Number });

  expect(console.warn).toBeCalledWith("Key 'id' is not of type 'Number'", {
    id: "1"
  });
});

test("accepts correct values", () => {
  class Custom {}
  const data = {
    id: 1,
    name: "Jane",
    favs: ["a", "b"],
    settings: {},
    custom: new Custom()
  };
  const schema = {
    id: Number,
    name: String,
    favs: Array,
    settings: Object,
    custom: Custom
  };

  validate(data, schema);

  expect(console.warn).not.toBeCalled();
});
