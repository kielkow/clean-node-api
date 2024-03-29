import {
  SaveSurveyResult,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (surveyData: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(surveyData)

    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyData.surveyId,
      surveyData.accountId
    )

    return surveyResult
  }
}
