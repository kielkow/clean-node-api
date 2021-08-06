import {
  Controller,
  HttpResponse,
  LoadSurveyById,
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
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(a => a.answer)

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
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
