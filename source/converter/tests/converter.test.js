import * as yup from 'yup';
import { convertJsonToYup } from '..';

console.log(yup);

const jsonData = [
    {
        name: 'Converts simple yup type (Number)',
        input: ['yup.number'],
        output: yup.number(),
    },
    {
        name: 'Converts simple type with required (Number)',
        input: ['yup.number', 'yup.required'],
        output: yup.number().required(),
    },
];

describe('correctly transforms data from JSON to YUP', () => {
    jsonData.forEach(({ name, input, output }) => {
        it(name, () => {
            expect(convertJsonToYup(input)).toEqual(output);
        });
    });
});
