import {
  GenericTransaction,
  TransactionPerformer,
} from '@app/core/application/ports/transaction-performer'
import { Inject, Injectable } from '@nestjs/common'
import { Knex } from 'knex'

@Injectable()
export class KnexTransactionPerformer implements TransactionPerformer {
  constructor(@Inject('Knex') private knex: Knex) {}

  async perform<T>(
    useCase: (trx: GenericTransaction) => Promise<T>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.knex.transaction(async (trx) => {
        try {
          const result = await useCase(trx)
          await trx.commit()
          resolve(result)
        } catch (e) {
          await trx.rollback(e)
          reject(e)
        }
      })
    })
  }
}
