const CUSTOM_VALIDATORS = {};

export function add(name, validator, binding = false) {
    if (binding !== false) {
        validator = validator.bind(binding);
    }

    CUSTOM_VALIDATORS[name] = validator;
}

export function del(name) {
    delete CUSTOM_VALIDATORS[name];
}

export function get(name) {
    return CUSTOM_VALIDATORS[name];
}

// Handle the case when we have an array of objects
// but the previous instance of yup.shape is the yup.array
setCustomValidator('yup.shape', yup.object().shape, yup.object());
