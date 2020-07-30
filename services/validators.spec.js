const validators = require("./validators");

describe("Validators service", () => {
  test("validates blank name", async () => {
    expect(validators.isBlank("")).toBe(true);
    expect(validators.isBlank()).toBe(true);
    expect(validators.isBlank("   ")).toBe(true);
    expect(validators.isBlank("any string")).toBe(false);
  });
});
