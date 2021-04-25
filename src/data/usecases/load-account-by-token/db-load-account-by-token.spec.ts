import { Decrypter } from '../../protocols/criptografy/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByTokenm', () => {
  test('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('any_value'))
      }
    }

    const decrypterStub = new DecrypterStub()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    const sut = new DbLoadAccountByToken(decrypterStub)

    await sut.load('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
