import { mockCheckSurveyById, mockLoadSurveyResult } from '../../mocks'

import { mockSurveyResultModel, throwError } from '../../../domain/mocks'

import {
  CheckSurveyById,
  LoadSurveyResult
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols'

import {
  LoadSurveyResultController
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'

import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper'

import { InvalidParamError } from '@/presentation/errors'

import MockDate from 'mockdate'

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()

  const sut = new LoadSurveyResultController(
    checkSurveyByIdStub,
    loadSurveyResultStub
  )

  return {
    sut,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()

    const loadByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')

    await sut.handle(mockRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()

    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(
      Promise.resolve(false)
    )

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()

    jest.spyOn(checkSurveyByIdStub, 'checkById').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')

    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()

    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
