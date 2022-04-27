const Model = require('../src/ModelBase');

class Post extends Model.Base {
    setup() {
        this.setAttribute("title", Model.Attributes.String);
        this.setAttribute("content", Model.Attributes.String);

        this.validate("title", Model.Validators.PresenceOf);
    }
}

module.exports = Post;