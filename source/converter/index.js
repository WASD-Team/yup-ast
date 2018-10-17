import * as yup from 'yup';

/**
 * Used when we're unable to find a function.
 * @returns {boolean} Always false.
 */
function defaultValidator() {
    return false;
}

/**
 * Searches for {substring} in {string}.
 * If found, returns the {string}, sliced after substring.
 *
 * @param {string} string - String to be sliced.
 * @param {string} substring - String to search for.
 * @returns {string|null} Null if no match found.
 */
function getSubString(string, substring) {
    const testedIndex = string.indexOf(substring);

    if (testedIndex > -1) {
        return string.slice(testedIndex + substring.length);
    }

    return null;
}

/**
 * Returns a function from yup, by passing in a function name from our schema.
 * @param {string} functionName - The string to search for a function.
 * @returns {function} Either the found yup function or the default validator.
 */
function getYupFunction(functionName) {
    const yupName = getSubString(functionName, 'yup.');

    if (yupName) {
        return yup[yupName];
    }

    return defaultValidator;
}

/**
 * Converts an array of ['yup.number'] to yup.number().
 * @param {[Any]} jsonArray - The validation array.
 */
function convertArray([functionName, ...argsToPass]) {
    return getYupFunction(functionName)(argsToPass);
}

/**
 * Takes in a set of json data as defined in our schema, and converts
 * it to a YUP validator.
 * @param {object|array} jsonArray - JSON data which will be transformed to yup.
 * @returns {function} New yup validator
 */
export function convertJsonToYup(jsonArray) {
    const toReturn = convertArray(jsonArray[0]);

    return toReturn;
}
