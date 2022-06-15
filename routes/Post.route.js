const Router = require('../src').Router;
const auth = require('../auth');

Router.get('/posts', 'PostsController#index');
//Router.get('/posts/:id', 'PostsController#show', [auth]);
Router.get('/postsSingle/:id', 'PostsController#show');
Router.post('/posts', 'PostsController#create');