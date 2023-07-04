export enum ParticipationType {
  Normal = 1,
  Popup = 2,
  Group = 3,
}

export const GetTranslatedParticipationType = (value: ParticipationType | number) => {
  if (value == ParticipationType.Normal) {
    return 'ParticipationType.Normal';
  }
  if (value == ParticipationType.Popup) {
    return 'ParticipationType.Popup';
  }
  if (value == ParticipationType.Group) {
    return 'ParticipationType.Group';
  }
  return 'ParticipationType.Unknown';
};
