import { MongoHelper } from '@/infra/db/mongodb/helpers'
import {
  SurveyMongoRepository
} from '@/infra/db/mongodb/survey/survey-mongo-repository'

import { Collection } from 'mongodb'
import FakeObjectID from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  return res.ops[0]._id
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add an survey on success', async () => {
      const sut = makeSut()

      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({ question: 'any_question' })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await mockAccountId()

      const result = await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      ])

      const survey = result.ops[0]

      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })

      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()

      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)

      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const accountId = await mockAccountId()

      const sut = makeSut()

      const surveys = await sut.loadAll(accountId)

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ],
          date: new Date()
        }
      )

      const sut = makeSut()
      const survey = await sut.loadById(res.ops[0]._id)

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(FakeObjectID.generate())

      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers by survey on success', async () => {
      const res = await surveyCollection.insertOne(
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      )
      const survey = res.ops[0]

      const sut = makeSut()
      const answers = await sut.loadAnswers(survey._id)

      expect(answers).toStrictEqual([
        survey.answers[0].answer,
        survey.answers[1].answer
      ])
    })

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(FakeObjectID.generate())

      expect(answers).toStrictEqual([])
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne(
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ],
          date: new Date()
        }
      )

      const sut = makeSut()
      const surveyExists = await sut.checkById(res.ops[0]._id)

      expect(surveyExists).toBe(true)
    })

    test('Should return false if survey does not exists', async () => {
      const sut = makeSut()
      const surveyExists = await sut.checkById(FakeObjectID.generate())

      expect(surveyExists).toBe(false)
    })
  })
})
