import {
  Controller,
  HttpResponse,
  LoadAnswersBySurvey,
  SaveSurveyResult
} from './save-survey-result-controller-protocols'

import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper'

import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request

      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId)

      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'))
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
