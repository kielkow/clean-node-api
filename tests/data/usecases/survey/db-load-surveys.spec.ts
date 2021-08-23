import { mockLoadSurveysRepository } from '../../mocks'

import { mockSurveyModels, throwError } from '../../../domain/mocks'

import {
  DbLoadSurveys
} from '@/data/usecases/survey/load-surveys/db-load-surveys'
import {
  LoadSurveysRepository
} from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'

import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()

  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()

    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    const accountId = 'any_id'

    await sut.load(accountId)

    expect(loadAllSpy).toHaveBeenCalledWith(accountId)
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.load('any_id')

    expect(surveys).toEqual(mockSurveyModels())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()

    jest.spyOn(
      loadSurveysRepositoryStub,
      'loadAll'
    ).mockImplementationOnce(throwError)

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  })
})
