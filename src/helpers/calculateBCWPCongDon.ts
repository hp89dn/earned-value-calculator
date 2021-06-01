export const calculateBCWPCongDong = (dataState: any[]) => {
  const result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let index = 0; index < dataState.length; index++) {
    const { percent } = dataState[index];
    for (let j = 0; j < percent.length; j++) {
      result[j] += percent[j][1];
    }
  }
  return result;
};
