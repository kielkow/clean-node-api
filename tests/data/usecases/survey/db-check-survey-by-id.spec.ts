import { mockCheckSurveyByIdRepository } from '../../mocks'

import { throwError } from '../../../domain/mocks'

import {
  DbCheckSurveyById
} from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id'
import {
  CheckSurveyByIdRepository
} from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id-protocols'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()

  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)

  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbCheckSurveyById', () => {
  test('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()

    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')

    await sut.checkById('any_id')

    expect(checkByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()

    const surveyExists = await sut.checkById('any_id')

    expect(surveyExists).toEqual(true)
  })

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(
      Promise.resolve(false)
    )

    const surveyExists = await sut.checkById('any_id')

    expect(surveyExists).toEqual(false)
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockImplementationOnce(
      throwError
    )

    const promise = sut.checkById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
