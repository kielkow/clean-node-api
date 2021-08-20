import { mockLoadSurveyByIdRepository } from '../../mocks'

import { throwError, mockSurveyModel } from '../../../domain/mocks'

import {
  DbLoadAnswersBySurvey
} from '@/data/usecases/survey/load-answers-by-survey/db-load-answers-by-survey'
import {
  LoadSurveyByIdRepository
} from '@/data/usecases/survey/load-answers-by-survey/db-load-answers-by-survey-protocols'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()

  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadAnswers('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return answers on success', async () => {
    const { sut } = makeSut()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([
      mockSurveyModel().answers[0].answer,
      mockSurveyModel().answers[1].answer
    ])
  })

  test('Should return empty array answers if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(
      throwError
    )

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
