import paths from './paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: '4Dev - Surveys to Developers',
    description: 'This is API documentation made using Typescript, TDD, Clean Architecture and following the principles of SOLID and Design Patterns.',
    version: '1.0.0',
    contact: {
      name: 'Matheus Kielkowski',
      email: 'matheuskiel@fiorifer.com.br',
      url: 'https://www.linkedin.com/in/matheus-kielkowski-429b1617a/'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [{
    url: '/api',
    description: 'Main Server'
  }],
  tags: [{
    name: 'Login',
    description: 'Login APIs'
  }, {
    name: 'Survey',
    description: 'Survey APIs'
  }],
  paths,
  schemas,
  components
}
