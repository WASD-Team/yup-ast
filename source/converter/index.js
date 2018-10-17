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
 * Here we check to see if a passed array could be a prefix notation function.
 * @param {array} item - Item to be checked.
 * @param {any} item.functionName - We'll check this, and perhaps it's a prefix function name.
 * @returns {boolean} True if we are actually looking at prefix notation.
 */
function isPrefixNotation([functionName]) {
    if (functionName instanceof Array) {
        if (isPrefixNotation(functionName)) return true;
    }

    if (typeof functionName !== 'string') return false;
    if (functionName.indexOf('yup.') < 0) return false;

    return true;
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

    return gotFunc(...argsToPass.map(transformAll));
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

/**
 * Steps into arrays and objects and resolve the items inside to yup validators.
 * @param {object|array} jsonObjectOrArray - Object to be transformed.
 * @returns {yup.Validator}
 */
export function transformAll(jsonObjectOrArray) {
    // We're dealing with an array
    // This could be a prefix notation function
    // If so, we'll call the converter
    if (jsonObjectOrArray instanceof Array) {
        if (isPrefixNotation(jsonObjectOrArray)) {
            return convertJsonToYup(jsonObjectOrArray);
        }

        return jsonObjectOrArray.map(transformAll);
    }

    // If we're dealing with an object
    // we should check each of the values for that object.
    // Some of them may also be prefix notation functiosn
    if (jsonObjectOrArray instanceof Object) {
        const toReturn = {};

        Object.entries(jsonObjectOrArray).forEach(([key, value]) => {
            toReturn[key] = transformAll(value);
        });

        return toReturn;
    }

    // No case here, just return anything else
    return jsonObjectOrArray;
}
