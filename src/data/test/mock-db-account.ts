import { AddAccountReposiory } from '@/data/protocols/db/account/add-account-repository'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'

export const mockAddAccountReposiory = (): AddAccountReposiory => {
  class AddAccountReposioryStub implements AddAccountReposiory {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  return new AddAccountReposioryStub()
}
