import ModelCore from "./core";

export function mergeFilters(instance, filters) {
  Object.entries(filters).forEach(([name, fn]) => {
    if (instance.hasOwnProperty(name))
      return console.warn(`A property named "${name}" is already defined.`);

    Object.defineProperty(instance, name, {
      get() {
        return new ModelCore(instance.$options, fn(instance.all()));
      }
    });
  });
}
