import { makeApolloServer } from './helpers'

import env from '@/main/config/env'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'

let surveyCollection: Collection
let accountCollection: Collection

let apolloServer: ApolloServer

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'name',
    email: 'email@example.com',
    password: '123',
    role: 'admin'
  })

  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResult ($surveyId: String!) {
        surveyResult (surveyId: $surveyId) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()

      const now = new Date()

      const surveyRes = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'http://image-name.com'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: now
      })

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString()
        }
      })

      expect(res.data.surveyResult.question).toBe('any_question')
      expect(res.data.surveyResult.date).toBe(now.toISOString())
      expect(res.data.surveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        },
        {
          answer: 'other_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()

      const surveyRes = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'http://image-name.com'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: now
      })

      const { query } = createTestClient({ apolloServer })

      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString()
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()

      const now = new Date()

      const surveyRes = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'http://image-name.com'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: now
      })

      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const res: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString(),
          answer: 'any_answer'
        }
      })

      expect(res.data.saveSurveyResult.question).toBe('any_question')
      expect(res.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(res.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        },
        {
          answer: 'other_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()

      const surveyRes = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'http://image-name.com'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: now
      })

      const { mutate } = createTestClient({ apolloServer })

      const res: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString(),
          answer: 'any_answer'
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})
