import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases/account/add-account'

export interface AddAccountReposiory {
  add: (
    accountData: AddAccountReposiory.Params
  ) => Promise<AddAccountReposiory.Result>
}

export namespace AddAccountReposiory {
  export type Params = AddAccount.Params

  export type Result = AccountModel
}
