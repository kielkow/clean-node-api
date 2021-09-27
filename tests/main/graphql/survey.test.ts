import app from '@/main/config/app'
import env from '@/main/config/env'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection

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

describe('Surveys GraphQL', () => {
  beforeAll(async () => {
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

  describe('Surveys Query', () => {
    const query = `
      query surveys {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `

    test('Should return Surveys', async () => {
      const accessToken = await makeAccessToken()

      const now = new Date()

      await surveyCollection.insertOne({
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

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('any_question')
      expect(res.body.data.surveys[0].date).toBe(now.toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          answer: 'any_answer',
          image: 'http://image-name.com'
        },
        {
          answer: 'other_answer',
          image: null
        }
      ])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()

      await surveyCollection.insertOne({
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

      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(403)
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
