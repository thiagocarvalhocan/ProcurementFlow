export interface LinkedUnitUpdate {
  endDate: Date | null;
  startDate: Date | null;
  descriptionWarning: string | null;
  rajsIds: (number | undefined)[];
  typeLinkMaterialServiceId: number;
  unitsIds: number[];
}
