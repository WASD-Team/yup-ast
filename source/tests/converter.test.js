import * as yup from 'yup';
import yupPrinter from 'yup/lib/util/printValue';

import { transformAll, transformObject, setDebug } from '..';

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
    {
        name: 'Converts simple type with falsy args',
        input: [['yup.number'], ['yup.required'], ['yup.min', 0]],
        validates: {
            // prettier-no-wrap
            success: [0, 50],
            failure: [-50],
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
        input: [
            ['yup.object'],
            ['yup.shape', { test: [['yup.object'], ['yup.shape', {}], ['yup.required']] }],
        ],
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
                failure.forEach(item =>
                    expect(generatedValidator.isValidSync(item)).toEqual(false),
                );
            });
        });
    });

    describe('string tests', () => {
        stringTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = transformAll(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item =>
                    expect(generatedValidator.isValidSync(item)).toEqual(false),
                );
            });
        });
    });

    describe('object tests', () => {
        objectTests.forEach(({ name, input, validates: { success = [], failure = [] } }) => {
            it(name, () => {
                const generatedValidator = transformAll(input);

                success.forEach(item => expect(generatedValidator.isValidSync(item)).toEqual(true));
                failure.forEach(item =>
                    expect(generatedValidator.isValidSync(item)).toEqual(false),
                );
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

        expect(validator.isValidSync({ title: { en: '12345', ru: '12345' }, value: 5 })).toEqual(
            true,
        );
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
            }),
        ).toEqual(false);

        expect(
            validator.isValidSync({
                test: {},
            }),
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
            ],
        ]);

        expect(validator.isValidSync([])).toEqual(false);
        expect(
            validator.isValidSync([
                {
                    number: 'A',
                },
            ]),
        ).toEqual(false);

        expect(
            validator.isValidSync([
                {
                    number: {},
                },
            ]),
        ).toEqual(false);

        expect(
            validator.isValidSync([
                {
                    number: 20,
                },
            ]),
        ).toEqual(true);

        expect(
            validator.isValidSync([
                {
                    number: 50,
                },
            ]),
        ).toEqual(true);

        expect(
            validator.isValidSync([
                {
                    number: 51,
                },
            ]),
        ).toEqual(false);

        expect(
            validator.isValidSync([
                {
                    number: 19,
                },
            ]),
        ).toEqual(false);
    });

    it('handles promise edge case test', async () => {
        const validator = transformAll([
            ['yup.object'],
            ['yup.required'],
            [
                'yup.shape',
                {
                    game: [['yup.string'], ['yup.required', 'wizard.validations.is_required']],
                    locale: [['yup.string'], ['yup.required', 'wizard.validations.is_required']],
                    category: [['yup.string'], ['yup.required', 'wizard.validations.is_required']],
                    subcategory: [
                        ['yup.string'],
                        ['yup.required', 'wizard.validations.is_required'],
                    ],
                },
            ],
        ]);

        expect(validator.isValidSync({ game: 'test' })).toEqual(false);
        expect(validator.isValidSync({ game: 'test', locale: 'test' })).toEqual(false);
        expect(validator.isValidSync({ game: 'test', locale: 'test', category: 'test' })).toEqual(
            false,
        );
        expect(
            validator.isValidSync({
                game: 'test',
                locale: 'test',
                category: 'test',
                subcategory: 'test',
            }),
        ).toEqual(true);

        try {
            await validator.validate({
                game: 'test',
                locale: 'test',
                category: 'test',
            });
        } catch (error) {
            expect(error.message).toEqual('wizard.validations.is_required');
        }
    });

    it('handles linked form validation', async () => {
        // We'll create a custom binding which checks if a number is > than another
        // number which already exists somewhere else in the form
        function greaterThan(ref, msg) {
            return this.test({
                exclusive: false,
                name: 'greaterThan',
                params: { reference: ref.path },
                // This must be a function
                // If not we lose some binding
                test: function(value) {
                    return value > this.resolve(ref);
                },
                message: msg || '${path} must be the greater than ${reference}',
            });
        }

        // Here we'll bind this new function to the yup.number generator
        yup.addMethod(yup.number, 'linkedGreaterThan', greaterThan);

        const validator = transformAll([
            ['yup.object'],
            ['yup.required'],
            [
                'yup.shape',
                {
                    testValueSimple: [['yup.number'], ['yup.required']],
                    linkedTest: [
                        ['yup.number'],
                        ['yup.required'],
                        ['yup.linkedGreaterThan', ['yup.ref', 'testValueSimple']],
                    ],
                },
            ],
        ]);

        expect(validator.isValidSync({ testValueSimple: 1 })).toEqual(false);
        expect(validator.isValidSync({ testValueSimple: 100, linkedTest: 1 })).toEqual(false);
        expect(validator.isValidSync({ testValueSimple: 100, linkedTest: 101 })).toEqual(true);
    });
});

describe('Complex edge cases', () => {
    function equalTo(ref, msg) {
        console.log(msg);
        return this.test({
            name: 'equalTo',
            exclusive: false,
            message: msg || 'DEFAULT error',
            params: {
                reference: ref.path,
            },
            test: function(value) {
                return value === this.resolve(ref);
            },
        });
    }

    yup.addMethod(yup.string, 'equalTo', equalTo);

    it('our yup ast validations can extract custom error', () => {
        const schema = transformAll([
            ['yup.object'],
            ['yup.required'],
            [
                'yup.shape',
                {
                    testValue1: [
                        ['yup.string'],
                        ['yup.equalTo', ['yup.ref', 'linkedValue'], 'CUSTOM error'],
                        ['yup.required'],
                    ],
                    testValue2: [
                        ['yup.string'],
                        ['yup.equalTo', ['yup.ref', 'linkedValue']],
                        ['yup.required'],
                    ],
                    testValue3: [
                        ['yup.string'],
                        ['yup.equalTo', ['yup.ref', 'linkedValue'], 'CUSTOM error2'],
                        ['yup.required'],
                    ],
                    linkedValue: [['yup.string']],
                },
            ],
        ]);

        try {
            schema.validateSync({
                testValue1: 'one',
                testValue2: 'two',
                testValue3: 'sdasd',
                linkedValue: 'three',
            });
            throw new Error('should.not.reach.here');
        } catch (err) {
            expect(err.message).toEqual('CUSTOM error2');
        }
    });
});
