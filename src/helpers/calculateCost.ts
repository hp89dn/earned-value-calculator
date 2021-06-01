export const getCosts = (costState: any) => {
  // cost data
  // chi phí lý thuyết hằng ngày
  const ltDaily = costState[0].map((c: any) => (c !== 0 ? c.toString() : ""));
  const ltsDaiLyData = ["", "", "", "", "", "Chi phí LT hằng ngày"];
  for (let index = 0; index < ltDaily.length; index++) {
    const element = ltDaily[index];
    ltsDaiLyData.push(element);
  }

  // chi phí lý thuyết cộng dồn
  const ltCongDon = costState[1].map((c: any) => (c !== 0 ? c.toString() : ""));
  const ltCongDonData = ["", "", "", "", "", "Chi phí LT cộng dồn"];
  for (let index = 0; index < ltCongDon.length; index++) {
    const element = ltCongDon[index];
    ltCongDonData.push(element);
  }

  // chi phí thực tế hằng ngày
  const ttDaily = costState[2].map((c: any) => (c !== 0 ? c.toString() : ""));
  const ttsDaiLyData = ["", "", "", "", "", "Chi phí LT hằng ngày"];
  for (let index = 0; index < ttDaily.length; index++) {
    const element = ttDaily[index];
    ttsDaiLyData.push(element);
  }

  // chi phí thực tế cộng dồn
  const ttCongDon = costState[3].map((c: any) => (c !== 0 ? c.toString() : ""));
  const ttCongDonData = ["", "", "", "", "", "Chi phí TT cộng dồn"];
  for (let index = 0; index < ttCongDon.length; index++) {
    const element = ttCongDon[index];
    ttCongDonData.push(element);
  }

  return [
    [...ltsDaiLyData],
    [...ltCongDonData],
    [...ttsDaiLyData],
    [...ttCongDonData],
  ];
};
