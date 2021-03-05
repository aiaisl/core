import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";

let dataPath: string | null = null;

/**
 * Class for loading/parsing data files from disk
 */
export default class Data {
  static setDataPath(path: string) {
    dataPath = path;
  }

  /**
   * Read in and parse a file. Current supports yaml and json
   * @param {string} filepath
   * @return {*} parsed contents of file
   */
  static parseFile(filepath: string) {
    if (!fs.existsSync(filepath)) {
      throw new Error(`File [${filepath}] does not exist!`);
    }

    const contents = fs.readFileSync(fs.realpathSync(filepath)).toString('utf8');
    const parsers = {
      '.yml': yaml.load,
      '.yaml': yaml.load,
      '.json': JSON.parse,
    };

    const ext = path.extname(filepath) as keyof typeof parsers;
    if (!(ext in parsers)) {
      throw new Error(`File [${filepath}] does not have a valid parser!`);
    }
    return parsers[ext](contents);
  }

  /**
   * Write data to a file
   * @param {string} filepath
   * @param {*} data
   * @param {function} callback
   */
  static saveFile(filepath: string, data?: unknown, callback?: () => void) {
    if (!fs.existsSync(filepath)) {
      throw new Error(`File [${filepath}] does not exist!`);
    }

    const serializers = {
      '.yml': yaml.dump,
      '.yaml': yaml.dump,
      '.json': function (data: unknown) {
        //Make it prettttty
        return JSON.stringify(data, null, 2);
      }
    };

    const ext = path.extname(filepath) as keyof typeof serializers;
    if (!(ext in serializers)) {
      throw new Error(`File [${filepath}] does not have a valid serializer!`);
    }

    const dataToWrite = serializers[ext](data);
    fs.writeFileSync(filepath, dataToWrite, 'utf8');

    if (callback) {
      callback();
    }
  }

  /**
   * load/parse a data file (player/account)
   * @param {string} type
   * @param {string} id
   * @return {*}
   */
  static load(type: string, id: string) {
    return this.parseFile(this.getDataFilePath(type, id));
  }

  /**
   * Save data file (player/account) data to disk
   * @param {string} type
   * @param {string} id
   * @param {*} data
   * @param {function} callback
   */
  static save(type: string, id: string, data: unknown, callback?: () => void) {
    fs.writeFileSync(this.getDataFilePath(type, id), JSON.stringify(data, null, 2), 'utf8');
    if (callback) {
      callback();
    }
  }

  /**
   * Check if a data file exists
   * @param {string} type
   * @param {string} id
   * @return {boolean}
   */
  static exists(type: string, id: string) {
    return fs.existsSync(this.getDataFilePath(type, id));
  }

  /**
   * get the file path for a given data file by type (player/account)
   * @param {string} type
   * @param {string} id
   * @return {string}
   */
  static getDataFilePath(type: string, id: string) {
    //TODO: 使用自定义异常处理
    if (!dataPath) {
      throw new Error("地址未初始化");
    }
    switch (type) {
      case 'player': {
        return path.join(dataPath, `player/${id}.json`);
      }
      case 'account': {
        return path.join(dataPath, `account/${id}.json`);
      }

      default: {
        //TODO: 使用自定义异常处理
        throw new Error("不支持的type: " + type);
      }
    }

  }

  /**
   * Determine whether or not a path leads to a legitimate JS file or not.
   * @param {string} path
   * @param {string} [file]
   * @return {boolean}
   */
  static isScriptFile(path: string, file: string) {
    file = file || path;
    return fs.statSync(path).isFile() && file.match(/js$/);
  }

  /**
   * load the MOTD for the intro screen
   * @return string
   */
  static loadMotd() {
    const motd = fs.readFileSync(dataPath + 'motd').toString('utf8');
    return motd;
  }
}
