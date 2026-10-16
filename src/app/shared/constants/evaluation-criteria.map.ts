export const EVALUATION_CRITERIA_MAP = {
  1: 'LowestPricePerItem',
  2: 'LowestTotalPrice',
  3: 'SelectVendor',
} as const;

export type EvaluationCriteriaId = keyof typeof EVALUATION_CRITERIA_MAP;
export type EvaluationCriteriaCode =
  (typeof EVALUATION_CRITERIA_MAP)[EvaluationCriteriaId];
