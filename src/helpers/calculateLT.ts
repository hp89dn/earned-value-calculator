export const calculateLTCost = (dataState: any[]) => {
  const result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let index = 0; index < dataState.length; index++) {
    const { months } = dataState[index];
    for (let j = 0; j < months.length; j++) {
      result[j] += months[j][0];
    }
  }
  return result.filter((e) => e !== 0);
};

export const calculateLTCD = (arr: number[]) => {
  const array = arr.filter((e) => e !== 0);
  const new_array = [...array];
  for (let i = 1; i < new_array.length; i++) {
    new_array[i] += new_array[i - 1];
  }
  return new_array.filter((e) => e !== 0);
};
