const resolvePath = require("../../../resolvePath");

describe("resolvePath", () => {
  it("resolve a relative local file in a child directory", () => {
    return resolvePath({name:"./assets/rando.js", referrer: { path: __filename }})
      .then(result => (
        expect(result.path).toEqual(expect.stringContaining("assets/rando.js"))
      ));
  });

  it("resolve a relative local file in the current directory", () => {
    return resolvePath({name:"./localfile.js", referrer: { path: __filename }})
      .then(result => (
        expect(result.path).toEqual(expect.stringContaining("/localfile.js"))
      ));
  });

  it("resolve a relative local file in a parent directory", () => {
    return resolvePath({name:"../../../resolvePath.js", referrer: { path: __filename }})
      .then(result => (
        expect(result.path).toEqual(expect.stringContaining("/resolvePath.js"))
      ));
  });

  it("resolve a relative local child directory", () => {
    return resolvePath({name:"./assets", referrer: { path: __filename }})
      .then(result => (
        expect(result.path).toEqual(expect.stringContaining("assets/index.js"))
      ));
  });

  it("resolve a relative local child directory that ends with .js", () => {
    return resolvePath({name:"./assets.js", referrer: { path: __filename }})
      .then(result => (
        expect(result.path).toEqual(expect.stringContaining("assets.js/index.js"))
      ));
  });

  it("resolve a relative local local file with in a child directory that ends with .js", () => {
    return resolvePath({name:"./assets.js/rando.js", referrer: { path: __filename }})
      .then(result => (
        expect(result.path).toEqual(expect.stringContaining("assets.js/rando.js"))
      ));
  });
});
