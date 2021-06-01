export const getJobRowExcelData = (dataState: any) => {
  const datas = dataState.map((data: any, index: number) => {
    // LT
    const lts = data.months.map((month: any) =>
      month[0] !== 0 ? month[0].toString() : ""
    );
    const lts_data = [
      (index + 1).toString(),
      data.name,
      data.months
        .filter((month: number[]) => month[0] > 0)
        .map((month: number[]) => month[0])
        .reduce((a: number, b: number) => a + b, 0),
      data.months.filter((month: any) => month[0] > 0).length.toString(),
      data.pred,
      data.type[0],
    ];
    for (let index = 0; index < lts.length; index++) {
      const element = lts[index];
      lts_data.push(element);
    }

    // TT
    const tts = data.months.map((month: any) =>
      month[1] !== 0 ? month[1].toString() : ""
    );
    const tts_data = ["", "", "", "", "", data.type[1]];
    for (let index = 0; index < tts.length; index++) {
      const element = tts[index];
      tts_data.push(element);
    }

    return [[...lts_data], [...tts_data]];
  });
  return datas;
};
