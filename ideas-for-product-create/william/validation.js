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
