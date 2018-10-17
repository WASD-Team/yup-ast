import yup from 'yup';

/**
 * Takes in a set of json data as defined in our schema, and converts
 * it to a YUP validator.
 * @param {object|array} jsonData - JSON data which will be transformed to yup.
 * @returns {function} New yup validator
 */
export function convertJsonToYup(jsonData) {
    console.log(jsonData);
}
