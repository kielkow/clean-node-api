import { mockAddSurveyRepository } from '../../mocks'

import { mockAddSurveyParams, throwError } from '../../../domain/mocks'

import {
  DbAddSurvey
} from '@/data/usecases/survey/add-survey/db-add-survey'
import {
  AddSurveyRepository
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols'

import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)

    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)

    const promise = sut.add(mockAddSurveyParams())

    await expect(promise).rejects.toThrow()
  })
})
