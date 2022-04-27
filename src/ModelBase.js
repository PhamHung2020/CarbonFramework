const { Attributes, Validators } = require('./ModelHelpers');

class Base {
    constructor(attrs = {}) {
        this._tableName = this.constructor.name.toLowerCase() + 's';
        this._persisted = true;
        this._beforeSaveHooks = [];
        this._afterSaveHooks = [];
        this._validatorHooks = [];
        this._attributes = [];
        this._changedAttributes = [];
        this.errors = [];

        // define model default attributes: id, createdAt, updatedAt
        this._attributes["id"] = {
            type: Attributes.Primary,
            value: null,
        };
        this.id = null;

        this._attributes["createdAt"] = {
            type: Attributes.DateTime,
            value: null,
        };
        this.createdAt = null;

        this._attributes["updatedAt"] = {
            type: Attributes.DateTime,
            value: null,
        };
        this.updatedAt = null;


        // call base setup
        this.setup();

        // set additional attributes if present
        if (Object.keys(attrs).length > 0 && attrs.constructor == Object) {
            this._setMassAttributes(attrs);
        }
    }

    setup() {

    }

    /* STATIC METHODS*/

    /* PUBLIC METHODS */
    setAttribute(attribute, type) {
        this._attributes[attribute] = {
            type: type,
            value: null
        };
        this[attribute] = null;
    }

    validate(attribute, validator) {
        this._validatorHooks.push({
            attribute,
            validator
        });
    }

    save() {
        this._reloadAttributes();
        this._checkValidators();

        if (this.errors.length > 0)
            return false;
        return true;
    }
    /* PRIVATE METHODS */

    _setMassAttributes(attrs) {
        for (let attr in attrs) {
            if (this._attributes[attr]) {
                this[attr] = attrs[attr];
                this._attributes[attr].value = attrs[attr];
            }
        }
    }

    _reloadAttributes() {
        for (let attr in this._attributes) {
            if (this._attributes[attr].value != this[attr] && !this._changedAttributes.includes(attr)) {
                this._changedAttributes.push(attr);
            }
            this._attributes[attr].value = this[attr];
        }
    }

    _checkValidators() {
        this._validatorHooks.forEach((hook) => {
            if (Array.isArray(hook.validator)) {
                hook.validator.forEach((deepHook) => {
                    if (typeof (deepHook) == "string") {
                        this[deepHook]();
                    } else {
                        deepHook(hook.attribute, this);
                    }
                })
            } else if (typeof (hook.validator) == "string") {
                this[hook.validator]();
            } else {
                hook.validator(hook.attribute, this);
            }
        });
    }
}

module.exports = {
    Attributes,
    Validators,
    Base
}