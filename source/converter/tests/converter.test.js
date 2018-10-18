import * as yup from 'yup';
import yupPrinter from 'yup/lib/util/printValue';

import { transformAll, transformObject } from '..';

describe('correctly walks a schema object', () => {
    it('walks arrays', () => {
        const result = transformAll([['yup.object'], ['yup.shape']]);

        expect(result).toBeInstanceOf(yup.object);
        expect(result.isValidSync({})).toEqual(true);
        expect(result.isValidSync(5)).toEqual(false);
    });

    it('walks arrays with objects', () => {
        const result = transformAll([
            ['yup.object'],
            ['yup.shape', { test: [['yup.number'], ['yup.required'], ['yup.max', 500]] }],
            ['yup.required'],
        ]);

        expect(result.isValidSync({})).toEqual(false);
        expect(result.isValidSync({ test: 5 })).toEqual(true);
        expect(result.isValidSync({ test: 501 })).toEqual(false);
    });

    it('walks arrays with objects containing multiple items', () => {
        const result = transformAll([
            ['yup.object'],
            [
                'yup.shape',
                {
                    test: [['yup.number'], ['yup.required'], ['yup.max', 500]],
                    name: [['yup.string'], ['yup.required'], ['yup.min', 4], ['yup.max', 12]],
                },
            ],
            ['yup.required'],
        ]);

        expect(result.isValidSync({})).toEqual(false);
        expect(result.isValidSync({ test: 5 })).toEqual(false);
        expect(result.isValidSync({ test: 501 })).toEqual(false);

        expect(result.isValidSync({ test: 500, name: '1234' })).toEqual(true);
        expect(result.isValidSync({ test: 500, name: '123' })).toEqual(false);
        expect(result.isValidSync({ test: 500, name: '123456789012' })).toEqual(true);
        expect(result.isValidSync({ test: 500, name: '1234567890123' })).toEqual(false);
    });
});

const numberTests = [
    {
        name: 'Converts simple yup type (Number)',
        input: [['yup.number']],
        output: yup.number(),
        validates: {
            // prettier-no-wrap
            success: [1],
            failure: ['A'],
        },
    },
    {
        name: 'Converts simple type with required (Number)',
        input: [['yup.number'], ['yup.required']],
        output: yup.number().required(),
        validates: {
            // prettier-no-wrap
            success: [1],
            failure: [],
        },
    },
    {
        name: 'Converts simple type with required chains (Number) (1/2)',
        input: [['yup.number'], ['yup.required'], ['yup.min', 50]],
        validates: {
            // prettier-no-wrap
            success: [50],
            failure: [],
        },
    },
    {
        name: 'Converts simple type with required chains (Number) (2/2)',
        input: [['yup.number'], ['yup.required'], ['yup.min', 50], ['yup.max', 500]],
        validates: {
            // prettier-no-wrap
            success: [50, 51, 499, 500],
            failure: [1, 2, 3, 4, 501, 502, 503],
        },
    },
];

const stringTests = [
    {
        name: 'Converts simple yup type (String)',
        input: [['yup.string']],
        validates: {
            // prettier-no-wrap
            success: ['A', 'ABC', 'ABC123', 1],
            failure: [null],
        },
    },
    {
        name: 'Converts simple type with required (String)',
        input: [['yup.string'], ['yup.required']],
        validates: {
            // prettier-no-wrap
            success: ['A', 'ABC', 'ABC123'],
            failure: [null],
        },
    },
    {
        name: 'Converts simple type with required chains (String) (1/2)',
        input: [['yup.string'], ['yup.required'], ['yup.min', 10]],
        validates: {
            // prettier-no-wrap
            success: ['1234567890', '123456789000000'],
            failure: ['123', 'abc'],
        },
    },
    {
        name: 'Converts simple type with required chains (String) (2/2)',
        input: [['yup.string'], ['yup.required'], ['yup.min', 10], ['yup.max', 12]],
        validates: {
            // prettier-no-wrap
            success: ['1234567890', '12345678901', '123456789012'],
            failure: ['1234567890123', '12345678901234'],
        },
    },
];

const objectTests = [
    {
        name: 'Creates a simple object',
        input: [['yup.object']],
        validates: {
            // prettier-no-wrap
            success: [{}],
            failure: ['123', 'abc'],
        },
    },
    {
        name: 'Creates a simple object shape',
        input: [['yup.object'], ['yup.shape', {}]],
        validates: {
            // prettier-no-wrap
            success: [{}],
            failure: ['123', 'abc'],
        },
    },
    {
        name: 'Creates a nested object shape',
        input: [['yup.object'], ['yup.shape', { test: [['yup.object'], ['yup.shape', {}], ['yup.required']] }]],
        validates: {
            // prettier-no-wrap
            success: [{ test: {} }],
            failure: [{}, { test: [['yup.object'], ['yup.shape', {}]] }],
        },
    },
    {
        name: 'Allows non-required object fields',
        input: [['yup.object'], ['yup.shape', { test: [['yup.object'], ['yup.shape', {}]] }]],
        validates: {
            // prettier-no-wrap
            success: [{ test: {} }, {}],
            failure: [{ test: [['yup.object'], ['yup.shape', {}]] }],
        },
    },
];

describe('correctly transforms data from JSON to YUP', () => {
    describe('number tests', () => {
        numberTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = transformAll(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(false));
            });
        });
    });

    describe('string tests', () => {
        stringTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = transformAll(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(false));
            });
        });
    });

    describe('object tests', () => {
        objectTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = transformAll(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(false));
            });
        });
    });
});

describe('transform object', () => {
    it('correctly transforms a basic object', () => {
        const validator = transformObject({});

        Object.values(validator).forEach(validator => {
            expect(validator.isValidSync({})).toEqual(true);
            expect(validator.isValidSync(5)).toEqual(false);
            expect(validator.isValidSync('A')).toEqual(false);
            expect(validator.isValidSync(false)).toEqual(false);
            expect(validator.isValidSync(new Map())).toEqual(true);
        });
    });

    it('correctly transforms a more complex object', () => {
        const validator = transformObject({
            test: [
                // prettier-no-wrap
                ['yup.number'],
                ['yup.required'],
                ['yup.min', 20],
                ['yup.max', 50],
            ],
        });

        Object.values(validator).forEach(validator => {
            expect(validator.isValidSync({})).toEqual(false);
            expect(validator.isValidSync('1')).toEqual(false);
            expect(validator.isValidSync('A')).toEqual(false);
            expect(validator.isValidSync(null)).toEqual(false);
            expect(validator.isValidSync(20)).toEqual(true);
            expect(validator.isValidSync(50)).toEqual(true);
            expect(validator.isValidSync(51)).toEqual(false);
            expect(validator.isValidSync(19)).toEqual(false);
        });
    });

    it('correctly transforms an object inside another object', () => {
        const validator = transformObject({
            test: [
                // prettier-no-wrap
                ['yup.object'],
                [
                    'yup.shape',
                    {
                        number: [
                            // prettier-no-wrap
                            ['yup.number'],
                            ['yup.required'],
                            ['yup.min', 20],
                            ['yup.max', 50],
                        ],
                    },
                ],
                ['yup.required'],
            ],
        });

        Object.values(validator).forEach(validator => {
            expect(validator.isValidSync({ number: {} })).toEqual(false);
            expect(validator.isValidSync({ number: '1' })).toEqual(false);
            expect(validator.isValidSync({ number: 'A' })).toEqual(false);
            expect(validator.isValidSync({ number: null })).toEqual(false);
            expect(validator.isValidSync({ number: 20 })).toEqual(true);
            expect(validator.isValidSync({ number: 50 })).toEqual(true);
            expect(validator.isValidSync({ number: 51 })).toEqual(false);
            expect(validator.isValidSync({ number: 19 })).toEqual(false);
        });
    });

    it('handles more complex object schema', () => {
        const validator = transformAll([
            ['yup.object'],
            ['yup.required'],
            [
                'yup.shape',
                {
                    title: [
                        ['yup.object'],
                        ['yup.required'],
                        [
                            'yup.shape',
                            {
                                en: [
                                    ['yup.string'],
                                    ['yup.required'],
                                    ['yup.min', 5, 'String must be at least 5 characters'],
                                    ['yup.max', 50, 'String must be at most 50 characters'],
                                ],
                                ru: [
                                    ['yup.string'],
                                    ['yup.required'],
                                    ['yup.min', 5, 'String must be at least 5 characters'],
                                    ['yup.max', 50, 'String must be at most 50 characters'],
                                ],
                            },
                        ],
                    ],
                    value: [['yup.number'], ['yup.required'], ['yup.min', 5]],
                },
            ],
        ]);

        expect(validator.isValidSync({ title: { en: '12345', ru: '12345' }, value: 5 })).toEqual(true);
        expect(validator.isValidSync({ title: { en: '12345', ru: '12345' } })).toEqual(false);
        expect(validator.isValidSync({ title: { ru: '12345' }, value: 5 })).toEqual(false);
        expect(validator.isValidSync({ title: { en: '12345' }, value: 5 })).toEqual(false);
        expect(validator.isValidSync({ title: { en: '12345', ru: '12345' } })).toEqual(false);
        expect(validator.isValidSync()).toEqual(false);
    });

    it('handles objects of objects', () => {
        const validator = transformAll([
            ['yup.object'],
            ['yup.required'],
            [
                'yup.shape',
                {
                    test: [
                        ['yup.object'],
                        ['yup.required'],
                        [
                            'yup.shape',
                            {
                                number: [
                                    // prettier-no-wrap
                                    ['yup.number'],
                                    ['yup.required'],
                                    ['yup.min', 20],
                                    ['yup.max', 50],
                                ],
                            },
                        ],
                    ],
                },
            ],
            ['yup.required'],
        ]);

        expect(validator.isValidSync({})).toEqual(false);
        expect(
            validator.isValidSync({
                test: {
                    number: 'A',
                },
            })
        ).toEqual(false);

        expect(
            validator.isValidSync({
                test: {},
            })
        ).toEqual(false);
    });

    it('handles arrays of objects', () => {
        const validator = transformAll([
            ['yup.array'],
            ['yup.required'],
            [
                'yup.of',
                [
                    ['yup.object'],
                    [
                        'yup.shape',
                        {
                            test: [
                                ['yup.object'],
                                ['yup.required'],
                                [
                                    'yup.shape',
                                    {
                                        number: [
                                            // prettier-no-wrap
                                            ['yup.number'],
                                            ['yup.required'],
                                            ['yup.min', 20],
                                            ['yup.max', 50],
                                        ],
                                    },
                                ],
                            ],
                        },
                    ],
                ],
            ],
        ]);

        expect(validator.isValidSync([])).toEqual(false);
        expect(
            validator.isValidSync([
                {
                    test: {
                        number: 'A',
                    },
                },
            ])
        ).toEqual(false);

        expect(
            validator.isValidSync([
                {
                    test: {},
                },
            ])
        ).toEqual(false);
    });
});
