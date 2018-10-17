import * as yup from 'yup';
import yupPrinter from 'yup/lib/util/printValue';

import { convertJsonToYup } from '..';

const numberTests = [
    {
        name: 'Converts simple yup type (Number)',
        input: [['yup.number']],
        output: yup.number(),
        validates: { success: [1], failure: ['A'] },
    },
    {
        name: 'Converts simple type with required (Number)',
        input: [['yup.number'], ['yup.required']],
        output: yup.number().required(),
        validates: { success: [1], failure: [] },
    },
    {
        name: 'Converts simple type with required chains (Number) (1/2)',
        input: [['yup.number'], ['yup.required'], ['yup.min', 50]],
        validates: { success: [50], failure: [] },
    },
    {
        name: 'Converts simple type with required chains (Number) (2/2)',
        input: [['yup.number'], ['yup.required'], ['yup.min', 50], ['yup.max', 500]],
        validates: { success: [50, 51, 499, 500], failure: [1, 2, 3, 4, 501, 502, 503] },
    },
];

const stringTests = [
    {
        name: 'Converts simple yup type (String)',
        input: [['yup.string']],
        validates: { success: ['A', 'ABC', 'ABC123', 1], failure: [null] },
    },
    {
        name: 'Converts simple type with required (String)',
        input: [['yup.string'], ['yup.required']],
        validates: { success: ['A', 'ABC', 'ABC123'], failure: [null] },
    },
    {
        name: 'Converts simple type with required chains (String) (1/2)',
        input: [['yup.string'], ['yup.required'], ['yup.min', 10]],
        validates: { success: ['1234567890', '123456789000000'], failure: ['123', 'abc'] },
    },
    {
        name: 'Converts simple type with required chains (String) (2/2)',
        input: [['yup.string'], ['yup.required'], ['yup.min', 10], ['yup.max', 12]],
        validates: {
            success: ['1234567890', '12345678901', '123456789012'],
            failure: ['1234567890123', '12345678901234'],
        },
    },
];

const objectTests = [
    {
        name: 'Creates a simple object',
        input: [['yup.object']],
        validates: { success: [{}], failure: ['123', 'abc'] },
    },
    {
        name: 'Creates a simple object shape',
        input: [['yup.object'], ['yup.shape', {}]],
        validates: { success: [{}], failure: ['123', 'abc'] },
    },
];

describe('correctly transforms data from JSON to YUP', () => {
    describe('number tests', () => {
        numberTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = convertJsonToYup(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(false));
            });
        });
    });

    describe('string tests', () => {
        stringTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = convertJsonToYup(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(false));
            });
        });
    });

    describe('object tests', () => {
        objectTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = convertJsonToYup(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(false));
            });
        });
    });
});
