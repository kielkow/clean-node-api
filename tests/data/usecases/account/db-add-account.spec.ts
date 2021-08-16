import {
  mockHasher,
  mockAddAccountReposiory,
  mockCheckAccountByEmailRepository
} from '../../mocks'

import {
  mockAddAccountParams,
  throwError
} from '../../../domain/mocks'

import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import {
  Hasher,
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/usecases/account/add-account/db-add-account-protocols'

type SutTypes ={
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountReposiory()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(mockAddAccountParams())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(mockAddAccountParams())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      Promise.resolve(false)
    )

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(false)
  })

  test('Should return true if CheckAccountByEmailRepository returns false', async () => {
    const { sut } = makeSut()

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(true)
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(
      Promise.resolve(true)
    )

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(false)
  })

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')

    await sut.add(mockAddAccountParams())

    expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })
})
