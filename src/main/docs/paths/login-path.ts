export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API to authenticate user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucess',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      }
    }
  }
}
