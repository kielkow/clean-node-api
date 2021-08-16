import {
  AddAccountRepository
} from '@/data/protocols/db/account/add-account-repository'
import {
  LoadAccountByEmailRepository
} from '@/data/protocols/db/account/load-account-by-email-repository'
import {
  LoadAccountByTokenRepository
} from '@/data/protocols/db/account/load-account-by-token-repository'
import {
  UpdateAccessTokenRepository
} from '@/data/protocols/db/account/update-access-token-repository'
import {
  CheckAccountByEmailRepository
} from '@/data/protocols/db/account/check-account-by-email-repository'

export const mockAddAccountReposiory = (): AddAccountRepository => {
  class AddAccountReposioryStub implements AddAccountRepository {
    async add (
      accountData: AddAccountRepository.Params
    ): Promise<AddAccountRepository.Result> {
      return await Promise.resolve(true)
    }
  }

  return new AddAccountReposioryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
      return await Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        password: 'any_password'
      })
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositoryStub implements CheckAccountByEmailRepository {
    async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
      return await Promise.resolve(false)
    }
  }

  return new CheckAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (
      token: string, role?: string
    ): Promise<LoadAccountByTokenRepository.Result> {
      return await Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}
