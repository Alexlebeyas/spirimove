export const isContestOver = (endDate: string): boolean => {
  const currentDate = new Date();
  const contestEndDate = new Date(endDate);

  return currentDate > contestEndDate;
};
