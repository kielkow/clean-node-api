import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '../../mocks'

import { throwError, mockSurveyResultModel } from '../../../domain/mocks'

import {
  LoadAnswersBySurvey,
  SaveSurveyResult
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'

import {
  SaveSurveyResultController
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper'

import { InvalidParamError } from '@/presentation/errors'

import MockDate from 'mockdate'

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()

  const sut = new SaveSurveyResultController(
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  )

  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')

    await sut.handle(mockRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()

    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(
      Promise.resolve([])
    )

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()

    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockImplementationOnce(
      throwError
    )

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'wrong_answer',
      accountId: 'any_account_id'
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(mockRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
