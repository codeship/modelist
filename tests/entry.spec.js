import EntryWrapper from "@/instance/entry";

const Entry = EntryWrapper();

const data = { id: 1, name: "Banana", createdAt: Date.now() };

describe("EntryWrapper", () => {
  test("methods can be added onto Entry and can be used individually or in map", () => {
    const localEntry = EntryWrapper({
      foo: () => "foo",
      uppercase: s => s.toUpperCase()
    });

    expect(localEntry().foo()).toEqual("foo");
    expect(
      localEntry()
        .map("foo")
        .uppercase()
    ).toEqual("FOO");
  });

  test("It's possible to wrap an Object into an Entry", () => {
    const entry = Entry(data);
    expect(entry).toMatchSnapshot();
  });

  test("#toString produces a nice readable output", () => {
    const entry = Entry(data);
    expect(entry.toString()).toBe(`Entry(${JSON.stringify(data)})`);
  });

  describe("#fold", () => {
    test("takes the value out of the Entry", () => {
      const entry = Entry(data).fold();
      expect(entry).toEqual(data);
    });

    test("can processes using a passedin function", () => {
      const capitalizeName = o => {
        o.name = o.name.toUpperCase();
        return o;
      };

      const entry = Entry(data).fold(capitalizeName);
      expect(entry.name).toBe("BANANA");
    });
  });

  describe("#map", () => {
    test("can process the value and return a new Entry", () => {
      const entry = Entry(data).map(o => o);
      expect(entry.toString()).toBe(`Entry(${JSON.stringify(data)})`);
    });

    test("processes and using a passed in function", () => {
      const capitalizeName = o => {
        o.name = o.name.toUpperCase();
        return o;
      };

      const entry = Entry(data).map(capitalizeName);
      expect(entry.fold().name).toBe("BANANA");
    });
  });
});
