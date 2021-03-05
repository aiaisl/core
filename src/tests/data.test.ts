import path from "path";
import fs from "fs";
import Data from "./../Data";

describe("Data", () => {
    beforeAll(() => {
        Data.setDataPath(path.join(__dirname, "attr/"));
        if (!fs.existsSync(path.join(__dirname, "attr"))) {
            fs.mkdirSync(path.join(__dirname, "attr"));
            fs.mkdirSync(path.join(__dirname, "attr/account"));
            fs.writeFileSync(path.join(__dirname, "attr/test.json"), JSON.stringify({ "json": "data" }, undefined, 2));
            fs.writeFileSync(path.join(__dirname, "attr/test-save-file.json"), JSON.stringify({ "json": "data" }, undefined, 2));
            fs.writeFileSync(path.join(__dirname, "attr/test.yaml"), "json: data");
        }
    });
    afterAll(() => {
        fs.rmdirSync(path.join(__dirname, "attr"), { recursive: true });
    });
    test("parseJSONFile", () => {
        const data = Data.parseFile(path.join(__dirname, "attr/test.json"));
        expect(data.json).toBe("data");
    });

    test("parseYamlFile", () => {
        const data = Data.parseFile(path.join(__dirname, "attr/test.yaml"));
        expect(data.json).toBe("data");
    });

    test("save", () => {
        expect(Data.exists("account", "testUser")).toBe(false);
        Data.save("account", "testUser", { json: "data" });
        expect(Data.exists("account", "testUser")).toBe(true);
    });

    test("save file", ()=> {
        Data.saveFile(path.join(__dirname, "attr/test-save-file.json"), {"save-file": "data"})
        const data = Data.parseFile(path.join(__dirname, "attr/test-save-file.json"));
        expect(data["save-file"]).toBe("data");
    })
})