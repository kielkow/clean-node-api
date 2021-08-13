import { mockLogErrorRepository } from '../../data/mocks'

import {
  LogControllerDecorator
} from '@/main/decorators/log-controller-decorator'

import {
  LogErrorRepository
} from '@/data/protocols/db/log/log-error-repository'

import { ok, serverError } from '@/presentation/helpers/http/http-helper'

import {
  Controller,
  HttpResponse
} from '@/presentation/protocols'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return await Promise.resolve(ok('ok'))
    }
  }

  return new ControllerStub()
}

const mockRequest = (): any => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()

  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(mockRequest())

    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same resullt of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok('ok'))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(mockServerError())
    )

    await sut.handle(mockRequest())

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
