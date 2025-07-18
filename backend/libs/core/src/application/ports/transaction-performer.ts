export type GenericTransaction = {}

export type TransactionableAsync<T = void> = (
  trx: GenericTransaction,
) => Promise<T>

export abstract class TransactionPerformer {
  abstract perform<T>(
    useCase: (trx: GenericTransaction) => Promise<T>,
  ): Promise<T>
}
