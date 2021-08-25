import { mockSurveyResultModel } from '../../domain/mocks'

import {
  SaveSurveyResultRepository
} from '@/data/protocols/db/survey-result/save-survey-result-repository'
import {
  LoadSurveyResultRepository
} from '@/data/protocols/db/survey-result/load-survey-result-repository'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyData: SaveSurveyResultRepository.Params): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }

  return new LoadSurveyResultRepositoryStub()
}
