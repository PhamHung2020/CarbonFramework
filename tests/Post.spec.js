const Post = require('../models/Post');
const { Validators } = require('../src/ModelBase');

describe('constructor', () => {
    test('table name defined correctly', () => {
        const post = new Post();
        expect(post._tableName).toBe("posts");
    });

    test('default attributes defined correctly', () => {
        const post = new Post();

        expect(post.id).toBe(null);
        expect(post.createdAt).toBe(null);
        expect(post.updatedAt).toBe(null);

        expect(post._attributes["id"].value).toBe(null);
        expect(post._attributes["createdAt"].value).toBe(null);
        expect(post._attributes["updatedAt"].value).toBe(null);

    });

    test('custom attributes defined correctly', () => {
        const post = new Post();

        expect(post.title).toBe(null);
        expect(post.content).toBe(null);
        expect(post._attributes["title"].value).toBe(null);
        expect(post._attributes["content"].value).toBe(null);
    });

    test('validate hook', () => {
        const post = new Post();

        expect(post._validatorHooks[0].attribute).toBe("title");
        expect(post._validatorHooks[0].validator).toBe(Validators.PresenceOf);
    });
});

describe('hooks', () => {
    test('return false if not valid', () => {
        const post = new Post();
        let postSaved = post.save();
        
        expect(postSaved).toBe(false);
        expect(post.errors.length).toBe(1);
        expect(post.errors[0]).toBe('title should be present.')
    });

    test('reload attributes', () => {
        const post = new Post();
        post.title = 'My new post';
        post.content = 'Content here';
        let postSaved = post.save();

        expect(postSaved).toBe(true);
        expect(post.errors.length).toBe(0);
        expect(post._attributes['title'].value).toBe('My new post');
        expect(post._attributes['content'].value).toBe('Content here');
        expect(post._changedAttributes).toEqual(['title', 'content']);
    });

    test('reload attributes mass assignment', () => {
        const post = new Post({ title: 'My new post', content: 'Content here'});
        let postSaved = post.save();

        //expect(postSaved).toBe(true);
        //expect(post.errors.length).toBe(0);
        expect(post._attributes['title'].value).toBe('My new post');
        expect(post._attributes['content'].value).toBe('Content here');
        expect(post._changedAttributes).toEqual([]);
    })
});