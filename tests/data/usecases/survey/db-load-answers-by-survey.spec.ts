import { mockLoadAnswersBySurveyRepository } from '../../mocks'

import { throwError, mockSurveyModel } from '../../../domain/mocks'

import {
  DbLoadAnswersBySurvey
} from '@/data/usecases/survey/load-answers-by-survey/db-load-answers-by-survey'
import {
  LoadAnswersBySurveyRepository
} from '@/data/usecases/survey/load-answers-by-survey/db-load-answers-by-survey-protocols'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()

  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)

  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('Should call LoadAnswersBySurveyRepository', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()

    const loadAnswersSpy = jest.spyOn(
      loadAnswersBySurveyRepositoryStub,
      'loadAnswers'
    )

    await sut.loadAnswers('any_id')

    expect(loadAnswersSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return answers on success', async () => {
    const { sut } = makeSut()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([
      mockSurveyModel().answers[0].answer,
      mockSurveyModel().answers[1].answer
    ])
  })

  test('Should return an empty array if LoadAnswersBySurveyRepository returns []', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()

    jest.spyOn(
      loadAnswersBySurveyRepositoryStub,
      'loadAnswers'
    ).mockReturnValueOnce(Promise.resolve([]))

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()

    jest.spyOn(
      loadAnswersBySurveyRepositoryStub,
      'loadAnswers'
    ).mockImplementationOnce(throwError)

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
