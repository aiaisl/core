import Config from "./../Config";

describe("Config", () => {
    test("get", () => {
        Config.load({ "a": "b" })
        expect(Config.get("a")).toBe("b");
        expect(Config.get("none-exist", "fallback")).toBe("fallback");
    });

    test("未初始化Config 抛出异常", () => {
        Config.clear();
        expect(() => { Config.get("a") }).toThrowError();
    })
})