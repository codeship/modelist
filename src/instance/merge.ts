import Core from "./core";

export function mergeFilters(instance: Core, filters: object) {
  Object.entries(filters).forEach(([name, fn]) => {
    if (instance.hasOwnProperty(name))
      return console.warn(`A property named "${name}" is already defined.`);

    Object.defineProperty(instance, name, {
      get() {
        return new Core(instance.$options, fn(instance.all()));
      }
    });
  });
}
