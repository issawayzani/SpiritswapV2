export enum FarmTransactionStatus {
  DEFAULT,
  WITHDRAWING,
  DEPOSITING,
  WRAPPING,
  CONFIRMING_DEPOSIT,
  CONFIRMING_WITHDRAW,
  CANCELLING,
}

export enum FarmTransactionType {
  DEPOSIT,
  WRAP,
  WITHDRAW,
}
