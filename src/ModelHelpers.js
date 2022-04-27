const Attributes = {
    String: "string",
    Integer: "integer",
    Float: "float",
    Primary: "primary",
    DateTime: "datetime"
};

const Validators = {
    PresenceOf(attribute, model) {
        if (model._attributes[attribute].value == null ||
            model._attributes[attribute].value == undefined) {
                model.errors.push(`${attribute} should be present.`);
            }
    },

    IsString(attribute, model) {
       if (typeof (model._attributes[attribute].value) != "string") {
           model.errors.push(`${attribute} should be a string.`);
       } 
    }
}

module.exports = {
    Attributes,
    Validators
}