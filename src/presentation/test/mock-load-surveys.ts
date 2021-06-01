import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModels } from '@/domain/test'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(mockSurveyModels()))
    }
  }

  return new LoadSurveysStub()
}
