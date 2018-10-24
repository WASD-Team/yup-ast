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
