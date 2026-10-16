export const EXPENSE_TYPE_MAP = {
  1: 'Extraordinary',
  2: 'Low Value',
} as const;

export type ExpenseTypeId = keyof typeof EXPENSE_TYPE_MAP;
export type ExpenseTypeDescrition = (typeof EXPENSE_TYPE_MAP)[ExpenseTypeId];
