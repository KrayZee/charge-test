/**
 * @class Country
 */
export default class Country {
    /**
     * @param {string} name
     * @param {string} code
     */
    constructor(name, code) {
        /** @member {string} Country#name */
        this.name = name;

        /** @member {string} Country#code */
        this.code = code;
    }
}