import {
  AddAccountReposiory
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

import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '../../domain/mocks'

export const mockAddAccountReposiory = (): AddAccountReposiory => {
  class AddAccountReposioryStub implements AddAccountReposiory {
    async add (
      accountData: AddAccountReposiory.Params
    ): Promise<AddAccountReposiory.Result> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new AddAccountReposioryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (
      token: string, role?: string
    ): Promise<LoadAccountByTokenRepository.Result> {
      return await Promise.resolve(mockAccountModel())
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
