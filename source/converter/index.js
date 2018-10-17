import * as yup from 'yup';

/**
 * Used when we're unable to find a function.
 * @returns {boolean} Always false.
 */
function defaultValidator() {
    return () => ({});
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
 * @param {object} objectToLookup - Object from previous validator result or yup itself.
 * @returns {function} Either the found yup function or the default validator.
 */
function getYupFunction(functionName, objectToLookup = yup) {
    const yupName = getSubString(functionName, 'yup.');

    if (yupName && objectToLookup[yupName] instanceof Function) {
        return objectToLookup[yupName].bind(objectToLookup);
    }

    return defaultValidator;
}

/**
 * Converts an array of ['yup.number'] to yup.number().
 * @param {[Any]} jsonArray - The validation array.
 * @param {object} previousInstance - The result of a call to yup.number()
 * i.e. an object schema validation set
 * @returns {function} generated yup validator
 */
function convertArray([functionName, ...argsToPass], previousInstance = yup) {
    const gotFunc = getYupFunction(functionName, previousInstance);

    // Ensure that we received a valid function from the extractor
    if (gotFunc instanceof Function === false) {
        console.error('Did not receive function');
    }

    return gotFunc(...argsToPass);
}

/**
 * Takes in a set of json data as defined in our schema, and converts
 * it to a YUP validator.
 * @param {object|array} jsonArray - JSON data which will be transformed to yup.
 * @returns {function} New yup validator
 */
export function convertJsonToYup(jsonArray) {
    let toReturn = convertArray(jsonArray[0]);

    jsonArray.slice(1).forEach(item => {
        toReturn = convertArray(item, toReturn);
    });

    return toReturn;
}
