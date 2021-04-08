import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountReposiory } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountReposiory
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)

    const account = await this.addAccountRepository.add(
      Object.assign(
        {},
        accountData,
        { password: hashedPassword }
      )
    )

    return account
  }
}
