import * as yup from 'yup';
import { convertJsonToYup } from '..';

const numberTests = [
    {
        name: 'Converts simple yup type (Number)',
        input: [['yup.number']],
        output: yup.number(),
    },
    {
        name: 'Converts simple type with required (Number)',
        input: [['yup.number'], ['yup.required']],
        output: yup.number().required(),
    },
    {
        name: 'Converts simple type with required chains (Number)',
        input: [['yup.number'], ['yup.required']],
        output: yup.number().required(),
    },
];

describe('correctly transforms data from JSON to YUP', () => {
    describe('number tests', () => {
        numberTests.forEach(({ name, input, output }) => {
            it(name, () => {
                expect(convertJsonToYup(input)).toEqual(output);
            });
        });
    });
});
