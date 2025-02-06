/**
 * Picks specific properties from an object.
 * @param {Object} object - The source object.
 * @param {string[]} keys - The keys to pick.
 * @returns {Object} A new object containing only the picked properties.
 */
const pick = (object, keys) => {
    return keys.reduce((result, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            result[key] = object[key];
        }
        return result;
    }, {});
};

module.exports = pick;
