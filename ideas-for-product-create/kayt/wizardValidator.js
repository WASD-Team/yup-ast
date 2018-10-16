const fs = require('fs');
const Joi = require('joi');
const stripJsonComments = require('strip-json-comments');

const wizard = JSON.parse(stripJsonComments(fs.readFileSync('./wizard.json').toString()));

const uuid = Joi.string().guid({ version: ['uuidv4', 'uuidv5'] });

const fieldScheme = Joi.object().keys({
    path: Joi.string(),
    name: Joi.string(),
    type: Joi.string(),
    validationErrors: Joi.object().pattern(/^(.*?)$/, Joi.string()),
    validations: Joi.object().pattern(/^(.*?)$/, Joi.alternatives(Joi.string(), Joi.number(), Joi.object())),
    childrenOptions: Joi.object(),
    children: Joi.alternatives().try(Joi.array().items(Joi.lazy(() => fieldScheme)), Joi.lazy(() => fieldScheme)),
    properties: Joi.object().keys({
        required: Joi.bool(),
        filterNormal: Joi.string(),
        showCommission: Joi.bool(),
        size: Joi.string(),
        title: Joi.string(),
        direction: Joi.string(),
        overflow: Joi.string(),
        placeholder: Joi.string(),
        renderTooltip: Joi.object(),
        subtitle: Joi.string(),
        showIf: Joi.object().keys({
            path: Joi.string(),
            value: Joi.any().exist(),
        }),
    }),
});

const wizardScheme = fieldScheme.keys({
    id: uuid,
    serverFields: Joi.array().items(Joi.any()),
});

console.error(wizardScheme.validate(wizard).error.details);
