const overgearProductOptions = [
    'yup.object',
    'yup.shape',
    {
        basePrice: ['yup.number', 'yup.required', ['yup.min', ['overgear.wizard.minPrice']]],
        // prettier-no-wrap
    },
];

const overgearProduct = [
    'yup.object',
    'yup.shape',
    {
        title: ['yup.string', 'yup.required'],
        game: ['yup.string', 'yup.required'],
        category: ['yup.string', 'yup.required'],
        options: ['overgear.product.options'],
        // prettier-no-wrap
    },
];

const json = [
    'yup.object',
    'yup.shape',
    {
        product: ['overgear.product'],
        title: ['yup.string', 'yup.required'],
        totalPrice: ['yup.number', 'yup.required', ['yup.min', 0]],
        // prettier-no-wrap
    },
];

const schema = yup.object().shape({
    name: yup.string().required(),
    age: yup
        .number()
        .required()
        .positive(),
});

const numberValidation = yup
    .number()
    .required()
    .positive();

const jsonNumberValidation = [['yup.number'], ['yup.required'], ['yup.positive']];

const numberValidationB = yup
    .number()
    .required()
    .positive()
    .min(50)
    .max(200);

const jsonNumberValidationB = [['yup.number'], ['yup.required'], ['yup.positive'], ['yup.min', 50], ['yup.max', 200]];

const objectValidation = yup.object().shape({
    number: yup.number
        .positive()
        .min(50)
        .max(200),
});

const jsonObjectValidation = [
    [
        'yup.object.shape',
        {
            number: [
                ['yup.number'],
                ['yup.positive'],
                ['yup.min', 50, 'number.too.small'],
                ['yup.max', 200, 'number.too.large'],
            ],
        },
    ],
];
