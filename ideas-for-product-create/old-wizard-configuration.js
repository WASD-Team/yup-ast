{
    "categories": ["other"],
    "enabled": true,
    "games": ["wow"],
    "id": "d913de13-222a-4bc4-ab94-6df027971d7a",
    "locales": ["eu"],
    "minPrice": {
        "amount": 50,
        "currency": "RUB"
    },
    "serverFields": [],
    "steps": [
        {
            "direction": "row",
            "fields": [
                {
                    "fields": [
                        {
                            "direction": "row",
                            "fields": [
                                {
                                    "model": {
                                        "from": "type",
                                        "save": "options.type"
                                    },
                                    "required": true,
                                    "size": "l",
                                    "title": "options.title.type",
                                    "type": "select"
                                }
                            ],
                            "type": "section"
                        }
                    ],
                    "subtitle": "wizard.description.params",
                    "title": "wizard.title.params",
                    "type": "section"
                }
            ],
            "title": "wizard.title.main_info"
        },
        {
            "fields": [
                {
                    "fields": [
                        {
                            "childFields": [
                                {
                                    "model": {
                                        "save": "title"
                                    },
                                    "name": "title",
                                    "placeholder": "placeholder.product_name",
                                    "required": true,
                                    "size": "xxl",
                                    "title": "fields.title.title",
                                    "type": "input",
                                    "validationErrors": {
                                        "maxLength": "wizard.validations.step2.title.maxLength",
                                        "minLength": "wizard.validations.step2.title.minLength",
                                        "minLetters": "wizard.validations.minLetters_1",
                                        "textRatio": "wizard.validations.step2.title.textRatio"
                                    },
                                    "validations": {
                                        "maxLength": 40,
                                        "minLength": 5,
                                        "minLetters": 1,
                                        "textRatio": 0.075
                                    }
                                },
                                {
                                    "model": {
                                        "save": "description"
                                    },
                                    "name": "description",
                                    "placeholder": "placeholder.product_description",
                                    "required": true,
                                    "size": "xxl",
                                    "title": "fields.title.description",
                                    "type": "textarea",
                                    "validationErrors": {
                                        "maxLength_Immutable": "wizard.validations.step2.description.maxLength",
                                        "minLength_Immutable": "wizard.validations.step2.title.minLength",
                                        "minLetters_Immutable": "wizard.validations.minLetters_1"
                                    },
                                    "validations": {
                                        "maxLength_Immutable": 1500,
                                        "minLength_Immutable": 5,
                                        "minLetters_Immutable": 1
                                    }
                                }
                            ],
                            "type": "tabs-block"
                        }
                    ],
                    "subtitle": "wizard.description.product",
                    "title": "wizard.title.product",
                    "type": "section"
                }
            ],
            "title": "wizard.title.name_and_description"
        },
        {
            "fields": [
                {
                    "direction": "row",
                    "fields": [
                        {
                            "model": {
                                "save": "options.duration"
                            },
                            "required": true,
                            "size": "xl",
                            "title": "date_time.time_to_delivery",
                            "type": "duration"
                        }
                    ],
                    "subtitle": "wizard.description.delivery",
                    "title": "wizard.title.delivery",
                    "type": "section"
                },
                {
                    "direction": "column",
                    "fields": [
                        {
                            "model": {
                                "save": "options.basePrice"
                            },
                            "overflow": "visible",
                            "renderTooltip": {
                                "data": {
                                    "text": "commission.will.apply"
                                },
                                "type": "info-tooltip"
                            },
                            "required": true,
                            "showCommission": true,
                            "showIf": {
                                "path": "options.emptyPrice",
                                "value": false
                            },
                            "size": "s",
                            "title": "fields.title.base_price",
                            "type": "currency"
                        },
                        {
                            "model": {
                                "save": "options.emptyPrice"
                            },
                            "size": "s",
                            "title": "fields.title.empty_price",
                            "type": "checkbox"
                        }
                    ],
                    "subtitle": "wizard.description.price",
                    "title": "wizard.title.price",
                    "type": "section",
                    "validations": {
                        "moreThanPriceUSD": 4
                    }
                },
                {
                    "direction": "row",
                    "fields": [
                        {
                            "addChildText": "fields.add_button.add_opt",
                            "canChangePosition": true,
                            "childPlaceholder": "placeholder.add_opt",
                            "childType": "additional-option",
                            "childValidationErrors": {
                                "isCurrency": "fields.validations.currency.not_empty",
                                "maxLength": "wizard.validations.raids_additionalOption.maxLength",
                                "minLetters": "wizard.validations.minLetters_1"
                            },
                            "childValidations": {
                                "isCurrency": {
                                    "value": true
                                },
                                "maxLength": {
                                    "name": 20,
                                    "onlyForChild": true
                                },
                                "minLetters": {
                                    "name": 1,
                                    "onlyForChild": true
                                }
                            },
                            "maxOptionsCnt": 25,
                            "model": {
                                "save": "options.additional",
                                "type": "ObjectArray"
                            },
                            "size": "xl",
                            "subtitle": "fields.subtitle.add_opt",
                            "title": "fields.title.add_opt",
                            "type": "dynamic-block"
                        }
                    ],
                    "type": "section"
                }
            ],
            "title": "wizard.title.options_and_prices"
        }
    ],
    "type": "wizards"
}
