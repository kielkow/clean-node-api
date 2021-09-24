import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
        query login ($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                accessToken,
                name
            }
        }
    `

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12)

      await accountCollection.insertOne({
        name: 'name',
        email: 'email@example.com',
        password
      })

      const { query } = createTestClient({ apolloServer })

      const res: any = await query(loginQuery, {
        variables: {
          email: 'email@example.com',
          password: '123'
        }
      })

      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe('name')
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })

      const res: any = await query(loginQuery, {
        variables: {
          email: 'email@example.com',
          password: '123'
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })

    test('Should return InvalidParamError on invalid e-mail', async () => {
      const { query } = createTestClient({ apolloServer })

      const res: any = await query(loginQuery, {
        variables: {
          email: 'email@example',
          password: '123'
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Invalid param: email')
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
        mutation signUp (
          $name: String!, 
          $email: String!, 
          $password: String!, 
          $passwordConfirmation: String!
        ) {
            signUp(
              name: $name, 
              email: $email, 
              password: $password,
              passwordConfirmation: $passwordConfirmation
            ) {
                accessToken,
                name
            }
        }
    `

    test('Should return an Account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })

      const res: any = await mutate(signUpMutation, {
        variables: {
          name: 'name',
          email: 'email@example.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })

      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe('name')
    })

    test('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12)

      await accountCollection.insertOne({
        name: 'name',
        email: 'email@example.com',
        password
      })

      const { mutate } = createTestClient({ apolloServer })

      const res: any = await mutate(signUpMutation, {
        variables: {
          name: 'name',
          email: 'email@example.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('The received email is already in use')
    })
  })
})
