const validators = require("./validators");

describe("Validators service", () => {
  test("blank name", async () => {
    expect(validators.isBlank("")).toBe(true);
    expect(validators.isBlank()).toBe(true);
    expect(validators.isBlank("   ")).toBe(true);
    expect(validators.isBlank("any string")).toBe(false);
  });

  test("password pattern", async () => {
    expect(validators.passwordPattern("")).toBe(false);
    expect(validators.passwordPattern()).toBe(false);
    expect(validators.passwordPattern("   ")).toBe(false);
    expect(validators.passwordPattern("any  ")).toBe(false);
    expect(validators.passwordPattern(" anysdsa  ")).toBe(true);
  });
});
