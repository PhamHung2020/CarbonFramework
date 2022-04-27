const Router = require('../src').Router;

Router.get('/posts', 'PostsController#index');
Router.get('/posts/:id', 'PostsController#show');
Router.post('/posts', 'PostsController#create', [authenticate, somemiddleware]);