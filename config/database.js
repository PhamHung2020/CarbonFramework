const config = {
  dev: {
    host: 'localhost',
    database: 'testcarbon',
    user: 'root',
    password: ''
  },
  test: {
    host: 'localhost',
    database: 'myframework_test',
    user: 'username',
    password: 'password'
  },
  production: {
    host: 'localhost',
    database: 'myframework_prod',
    user: 'username',
    password: 'password'
  }
};

module.exports = config[process.env.NODE_ENV];