const Router = require('../src').Router;
const auth = require('../auth');

Router.get('/posts', 'PostsController#index');
Router.get('/posts/:id', 'PostsController#show', [auth]);
Router.post('/posts', 'PostsController#create');