import get from 'lodash/get';
import set from 'lodash/set';

import * as yup from 'yup';

/**
 * __MUTATES__ {object} __MUTATES___
 * Check to see if an object has {key}
 * If the object has key, return it
 * If the object does not, add {defaultVal} to the object
 * then return {defaultVal}
 *
 * @public
 * @param key {string} Key to lookup in the item
 * @param defaultVal {any} Value to be given to that key if it does not already exist
 * @param object {object} takes object
 */
export function addDefault(object, key, defaultVal) {
    const item = get(object, key, undefined);
    if (item !== undefined) {
        return item;
    }
    set(object, key, defaultVal);
    return defaultVal;
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
    if (!string) return null;

    const testedIndex = string.indexOf(substring);

    if (testedIndex > -1) {
        return string.slice(testedIndex + substring.length);
    }

    return null;
}

/**
 * Returns a function from yup, by passing in a function name from our schema.
 * @param {string} functionName - The string to search for a function.
 * @param {object} options - Parameters for the schema.
 * @param {object} options.previousInstance - Object from previous validator result or yup itself.
 * @returns {function} Either the found yup function or the default validator.
 */
function getYupFunction(functionName, options = {}) {
    const { previousInstance = yup } = options;

    const yupName = getSubString(functionName, 'yup.');

    if (previousInstance[yupName] instanceof Function) {
        return previousInstance[yupName].bind(previousInstance);
    }

    if (yupName && yup[yupName] instanceof Function) {
        return yup[yupName].bind(yup);
    }

    console.log(options);
    debugger;
    throw new Error('Could not find validation function ' + functionName);
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
 * Ensures that prefix functions come as an array.
 * @param {array|string} arrayToExtract - Sometimes we might recurse too deep, and this could be a string.
 * @returns {array} With the function name as the first argument.
 */
function ensureFunctionName(arrayToExtract) {
    if (typeof arrayToExtract === 'string') {
        return [arrayToExtract];
    }

    return arrayToExtract;
}

/**
 * Converts an array of ['yup.number'] to yup.number().
 * @param {[Any]} jsonArray - The validation array.
 * @param {object} previousInstance - The result of a call to yup.number()
 * i.e. an object schema validation set
 * @returns {function} generated yup validator
 */
function convertArray(arrayToConvert, options = {}) {
    const [functionName, ...argsToPass] = ensureFunctionName(arrayToConvert);

    const gotFunc = getYupFunction(functionName, options);

    // Ensure that we received a valid function from the extractor
    if (gotFunc instanceof Function === false) {
        console.error('Did not receive function');
    }

    return gotFunc(...argsToPass.map(i => transformAll(i, options)));
}

/**
 * Takes in a set of json data as defined in our schema, and converts
 * it to a YUP validator.
 * @param {object|array} jsonArray - JSON data which will be transformed to yup.
 * @returns {function} New yup validator
 */
export function convertJsonToYup(jsonArray, options = {}) {
    // Don't recurse too deply into arrays
    const [firstArgument] = jsonArray;
    console.log('Argument', firstArgument);
    if (typeof firstArgument === 'string') {
        return convertArray(jsonArray, { previousInstance: getYupFunction(firstArgument, options)() });
    }

    let toReturn = convertArray(firstArgument);

    jsonArray.slice(1).forEach(item => {
        console.log(toReturn);
        toReturn = convertArray(item, { previousInstance: toReturn });
    });

    return toReturn;
}

/**
 * Steps into arrays and objects and resolve the items inside to yup validators.
 * @param {object|array} jsonObjectOrArray - Object to be transformed.
 * @returns {yup.Validator}
 */
export function transformAll(jsonObjectOrArray, options = {}) {
    // We're dealing with an array
    // This could be a prefix notation function
    // If so, we'll call the converter
    if (jsonObjectOrArray instanceof Array) {
        if (isPrefixNotation(jsonObjectOrArray)) {
            return convertJsonToYup(jsonObjectOrArray, options);
        }

        return jsonObjectOrArray.map(i => transformAll(i, options));
    }

    // If we're dealing with an object
    // we should check each of the values for that object.
    // Some of them may also be prefix notation functiosn
    if (jsonObjectOrArray instanceof Object) {
        const toReturn = {};

        Object.entries(jsonObjectOrArray).forEach(([key, value]) => {
            toReturn[key] = transformAll(value, options);
        });

        return toReturn;
    }

    // No case here, just return anything else
    return jsonObjectOrArray;
}
