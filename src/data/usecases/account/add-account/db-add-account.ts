import {
  AddAccount,
  Hasher,
  AddAccountReposiory,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

import { AccountModel } from '@/domain/models/account'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountReposiory,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    )

    let newAccount: AccountModel = null

    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)

      newAccount = await this.addAccountRepository.add(
        { ...accountData, password: hashedPassword }
      )
    }

    return newAccount != null
  }
}
