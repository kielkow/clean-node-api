import {
  AddAccountRepository
} from '@/data/protocols/db/account/add-account-repository'
import {
  CheckAccountByEmailRepository
} from '@/data/protocols/db/account/check-account-by-email-repository'
import {
  LoadAccountByEmailRepository
} from '@/data/protocols/db/account/load-account-by-email-repository'
import {
  LoadAccountByTokenRepository
} from '@/data/protocols/db/account/load-account-by-token-repository'
import {
  UpdateAccessTokenRepository
} from '@/data/protocols/db/account/update-access-token-repository'

import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  CheckAccountByEmailRepository {
  async add (
    accountData: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    return result.insertedId !== null
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1
      }
    })

    return account !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1,
        name: 1,
        password: 1
      }
    })

    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')

    await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    }, {
      projection: {
        _id: 1
      }
    })

    return account && MongoHelper.map(account)
  }
}
