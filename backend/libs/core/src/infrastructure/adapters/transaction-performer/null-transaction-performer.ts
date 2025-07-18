import {
  GenericTransaction,
  TransactionPerformer,
} from '@app/core/application/ports/transaction-performer'

export class NullTransformationPerformer implements TransactionPerformer {
  async perform<T>(
    useCase: (trx: GenericTransaction) => Promise<T>,
  ): Promise<T> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return useCase(null as any)
  }
}
