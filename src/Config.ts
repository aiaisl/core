let __cache: { [index: string]: unknown } | null = null;

/**
 * Access class for the `ranvier.json` config
 */
export default class Config {
  /**
   * @param {string} key
   * @param {*} fallback fallback value
   */
  static get<T>(key: string, fallback?: T) {
    //TODO: 使用自定义异常处理
    if (!__cache) {
      throw new Error("__cache 未初始化，可能是load未调用")
    }
    return (key in __cache ? __cache[key] : fallback) as T;
  }

  /**
   * Load `ranvier.json` from disk
   */
  static load(data: { [index: string]: unknown }) {
    __cache = data;
  }

  static clear() {
    __cache = null;
  }
}
