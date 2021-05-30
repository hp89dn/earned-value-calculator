import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { test1 } from "../../data/test";
import { Button, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  calculateLTCD,
  calculateLTCost,
  calculateTTCost,
  calculateTTTCD,
} from "../../helpers";
import * as XLSX from "xlsx";
import { BChart, LChart } from "../../components";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

interface Row {
  name: string;
  d: number;
  pred: string;
  type: string[];
  months: number[][];
}

const initialRow: Row = {
  name: "",
  d: 0,
  type: ["LT", "TT"],
  pred: "",
  months: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

export const EarnedValueScreen = () => {
  const classes = useStyles();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const [dataState, setDataState] = useState<Row[]>(test1);
  const rows: Row[] = [...dataState];

  const [costState, setCostState] = useState<number[][]>([]);

  const handleCalculate = useCallback(() => {
    const ltCost = calculateLTCost(dataState);
    const ltCDCost = calculateLTCD(ltCost);
    const ttCost = calculateTTCost(dataState);
    const ttCDCost = calculateTTTCD(ttCost);
    const cost = [[...ltCost], [...ltCDCost], [...ttCost], [...ttCDCost]];
    setCostState(cost);
  }, [dataState]);

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate, dataState]);

  const handleDeleteRow = (i: number): void => {
    const datas = JSON.parse(JSON.stringify(dataState));
    const newArray = [...datas].filter((data, index) => index !== i);
    setDataState([]);
    setDataState([...newArray]);
  };

  const handleExportExcel = () => {
    const headers = [
      "STT",
      "Công việc",
      "D",
      "Pred",
      "Loại",
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    // jobs data
    const rows = dataState.map((data, index) => {
      // LT
      const lts = data.months.map((month) =>
        month[0] !== 0 ? month[0].toString() : ""
      );
      const lts_data = [
        (index + 1).toString(),
        data.name,
        data.months.filter((month) => month[0] > 0).length.toString(),
        data.pred,
        data.type[0],
      ];
      for (let index = 0; index < lts.length; index++) {
        const element = lts[index];
        lts_data.push(element);
      }

      // TT
      const tts = data.months.map((month) =>
        month[1] !== 0 ? month[1].toString() : ""
      );
      const tts_data = ["", "", "", "", data.type[1]];
      for (let index = 0; index < tts.length; index++) {
        const element = tts[index];
        tts_data.push(element);
      }

      return [[...lts_data], [...tts_data]];
    });

    // push job data to data array
    const data = [[...headers]];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      for (let i = 0; i < row.length; i++) {
        const element = row[i];
        data.push(element);
      }
    }

    // cost data
    // chi phí lý thuyết hằng ngày
    const ltDaily = costState[0].map((c) => (c !== 0 ? c.toString() : ""));
    const ltsDaiLyData = ["", "", "", "", "Chi phí LT hằng ngày"];
    for (let index = 0; index < ltDaily.length; index++) {
      const element = ltDaily[index];
      ltsDaiLyData.push(element);
    }

    // chi phí lý thuyết cộng dồn
    const ltCongDon = costState[1].map((c) => (c !== 0 ? c.toString() : ""));
    const ltCongDonData = ["", "", "", "", "Chi phí LT cộng dồn"];
    for (let index = 0; index < ltCongDon.length; index++) {
      const element = ltCongDon[index];
      ltCongDonData.push(element);
    }

    // chi phí thực tế hằng ngày
    const ttDaily = costState[2].map((c) => (c !== 0 ? c.toString() : ""));
    const ttsDaiLyData = ["", "", "", "", "Chi phí LT hằng ngày"];
    for (let index = 0; index < ttDaily.length; index++) {
      const element = ttDaily[index];
      ttsDaiLyData.push(element);
    }

    // chi phí thực tế cộng dồn
    const ttCongDon = costState[3].map((c) => (c !== 0 ? c.toString() : ""));
    const ttCongDonData = ["", "", "", "", "Chi phí TT cộng dồn"];
    for (let index = 0; index < ttCongDon.length; index++) {
      const element = ttCongDon[index];
      ttCongDonData.push(element);
    }

    const costRows = [
      [...ltsDaiLyData],
      [...ltCongDonData],
      [...ttsDaiLyData],
      [...ttCongDonData],
    ];

    data.push(["-"]);
    for (let i = 0; i < costRows.length; i++) {
      const element = costRows[i];
      data.push(element);
    }

    // create sheet and import data to sheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    const merge = [];
    const i = 2 * rows.length + 1;
    // merge cost column
    merge.push({ s: { r: i, c: 0 }, e: { r: i, c: 16 } });
    // let's merge cell
    ws["!merges"] = merge;

    // create workbook
    const wb = XLSX.utils.book_new();
    //append sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  const handleImportExcel = async (file: any) => {
    const { files } = file.target;
    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      try {
        const { result } = event.target;
        // Read the entire excel table object in binary stream
        const workbook = XLSX.read(result, { type: "binary" });
        let data: any = []; // store the acquired data
        // Traverse each worksheet for reading (here only the first table is read by default)
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // Convert excel to json data using the sheet_to_json method
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );

            // break; // If you only take the first table, uncomment this line
          }
        }

        const emptyIndex = data.findIndex((d: any) => d.STT === "-");
        const jobs = [];
        for (let i = 0; i < emptyIndex; i = i + 2) {
          const jobData = {
            name: data[i]["Công việc"],
            d: data[i]["D"],
            pred: data[i]["Pred"],
            type: [data[i]["Loại"], data[i + 1]["Loại"]],
            months: [
              [
                Number(data[i]["Tháng 1"]) || 0,
                Number(data[i + 1]["Tháng 1"]) || 0,
              ],
              [
                Number(data[i]["Tháng 2"]) || 0,
                Number(data[i + 1]["Tháng 2"]) || 0,
              ],
              [
                Number(data[i]["Tháng 3"]) || 0,
                Number(data[i + 1]["Tháng 3"]) || 0,
              ],
              [
                Number(data[i]["Tháng 4"]) || 0,
                Number(data[i + 1]["Tháng 4"]) || 0,
              ],
              [
                Number(data[i]["Tháng 5"]) || 0,
                Number(data[i + 1]["Tháng 5"]) || 0,
              ],
              [
                Number(data[i]["Tháng 6"]) || 0,
                Number(data[i + 1]["Tháng 6"]) || 0,
              ],
              [
                Number(data[i]["Tháng 7"]) || 0,
                Number(data[i + 1]["Tháng 7"]) || 0,
              ],
              [
                Number(data[i]["Tháng 8"]) || 0,
                Number(data[i + 1]["Tháng 8"]) || 0,
              ],
              [
                Number(data[i]["Tháng 9"]) || 0,
                Number(data[i + 1]["Tháng 9"]) || 0,
              ],
              [
                Number(data[i]["Tháng 10"]) || 0,
                Number(data[i + 1]["Tháng 10"]) || 0,
              ],
              [
                Number(data[i]["Tháng 11"]) || 0,
                Number(data[i + 1]["Tháng 11"]) || 0,
              ],
              [
                Number(data[i]["Tháng 12"]) || 0,
                Number(data[i + 1]["Tháng 12"]) || 0,
              ],
            ],
          };
          jobs.push(jobData);
        }
        setDataState([]);
        setDataState(jobs);
        return [...data];
      } catch (e) {
        // Here you can throw a related prompt with a file type error incorrect.
        console.log("file type is incorrect");
        return;
      }
    };
    // Open the file in binary mode
    try {
      fileReader.readAsBinaryString(files[0]);
    } catch (error) {
      return;
    }
  };

  const getChartData = () => {
    const ltDaiLyCost = [],
      ltCongDonCost = [],
      ttDaiLyCost = [],
      ttCongDonCost = [];
    for (let index = 0; index < 12; index++) {
      ltDaiLyCost.push({
        name: `Tháng ${index + 1}`,
        "Chi phí LT":
          costState[0] && costState[0][index] !== 0
            ? costState[0][index]
            : null,
      });

      ltCongDonCost.push({
        name: `Tháng ${index + 1}`,
        "Chi phí LT":
          costState[1] && costState[1][index] !== 0
            ? costState[1][index]
            : null,
      });

      ttDaiLyCost.push({
        name: `Tháng ${index + 1}`,
        "Chi phí TT":
          costState[2] && costState[2][index] !== 0
            ? costState[2][index]
            : null,
      });

      ttCongDonCost.push({
        name: `Tháng ${index + 1}`,
        "Chi phí TT":
          costState[3] && costState[3][index] !== 0
            ? costState[3][index]
            : null,
      });
    }
    return [
      [...ltDaiLyCost],
      [...ltCongDonCost],
      [...ttDaiLyCost],
      [...ttCongDonCost, { name: "Tháng 9", "Chi phí TT": null }],
    ];
  };

  const [
    ltDaiLyCostChartData,
    ltCongDonCostChartData,
    ttDaiLyCostChartData,
    ttCongDonCostChartData,
  ] = getChartData();

  return (
    <>
      <TableContainer>
        <Table
          className={classes.table}
          style={{ width: "100%", backgroundColor: "#e9ecef" }}
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Công việc</TableCell>
              <TableCell align="center">D</TableCell>
              <TableCell align="center">Pred</TableCell>
              <TableCell align="center">Loại đường </TableCell>
              {months.map((m, i) => (
                <TableCell align="center">Tháng {i + 1}</TableCell>
              ))}
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <span style={{ width: "5px" }}>{index + 1}</span>
                </TableCell>
                <TableCell align="center">
                  <input
                    type="text"
                    min={0}
                    placeholder="Nhập tên công việc"
                    value={dataState[index].name}
                    onChange={(e) => {
                      const data = [...dataState];
                      data[index].name = e.target.value;
                      setDataState([...data]);
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  {
                    <span style={{ width: "40px" }}>
                      {
                        dataState[index].months.filter((month) => month[0] > 0)
                          .length
                      }
                    </span>
                  }
                </TableCell>
                <TableCell align="center">
                  {
                    <input
                      type="text"
                      style={{ width: "25px" }}
                      placeholder=""
                      value={dataState[index].pred}
                      onChange={(e) => {
                        const data = [...dataState];
                        data[index].pred = e.target.value;
                        setDataState([...data]);
                      }}
                    />
                  }
                </TableCell>
                <TableCell align="center">
                  {row.type.map((t, i) => (
                    <div
                      style={{
                        color: i === 0 ? "blue" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </TableCell>
                {row.months.map((r, i) => (
                  <TableCell align="center">
                    <div>
                      <input
                        style={{
                          width: "40px",
                          border: "none",
                          textAlign: "center",
                          color: r[0] !== 0 ? "blue" : "black",
                          fontWeight: r[0] !== 0 ? "bold" : "normal",
                          backgroundColor: r[0] !== 0 ? "#ade8f4" : "#fff",
                        }}
                        type="number"
                        min={0}
                        value={r[0]}
                        onChange={(e) => {
                          const data = JSON.parse(JSON.stringify(dataState));
                          data[index].months[i][0] = Number(e.target.value);
                          setDataState(data);
                        }}
                      />
                    </div>
                    <div>
                      <input
                        style={{
                          width: "40px",
                          color: r[1] !== 0 ? "red" : "black",
                          border: "none",
                          textAlign: "center",
                          fontWeight: r[1] !== 0 ? "bold" : "normal",
                          backgroundColor: r[1] !== 0 ? "#f7cad0" : "#fff",
                        }}
                        type="number"
                        min={0}
                        value={r[1]}
                        onChange={(e) => {
                          const data = [...dataState];
                          data[index].months[i][1] = Number(e.target.value);
                          setDataState(data);
                        }}
                      />
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteRow(index)}
                    color="secondary"
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={4} />
              <TableCell align="right" colSpan={4}>
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  Chi phí LT hằng ngày
                </span>
              </TableCell>
              {costState && costState[0]
                ? costState[0].map((cost) => (
                    <TableCell align="center">
                      <span style={{ color: "blue", fontWeight: "bold" }}>
                        {cost !== 0 ? cost : ""}
                      </span>
                    </TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  Chi phí LT cộng dồn
                </span>
              </TableCell>
              {costState && costState[0]
                ? costState[1].map((cost) => (
                    <TableCell align="center">
                      <span style={{ color: "blue", fontWeight: "bold" }}>
                        {cost !== 0 ? cost : ""}
                      </span>
                    </TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Chi phí TT hằng ngày
                </span>
              </TableCell>
              {costState && costState[0]
                ? costState[2].map((cost) => (
                    <TableCell align="center">
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {cost !== 0 ? cost : ""}
                      </span>
                    </TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Chi phí TT cộng dồn
                </span>
              </TableCell>
              {costState && costState[0]
                ? costState[3].map((cost) => (
                    <TableCell align="center">
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {cost !== 0 ? cost : ""}
                      </span>
                    </TableCell>
                  ))
                : ""}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <hr />
      <div className="d-flex flex-row justify-content-around">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDataState([...dataState, { ...initialRow }])}
        >
          Thêm Công Việc
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleExportExcel()}
        >
          Export to Excel
        </Button>
        <Button variant="contained" color="secondary" component="label">
          Import Excel File
          <input
            hidden
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => handleImportExcel(e)}
          />
        </Button>
      </div>
      <hr />
      <div className="row">
        <div className="col-3">
          <h3 className="text-center">Chi phí ngân quỹ hàng tháng</h3>
          <BChart data={ltDaiLyCostChartData} dataKey={"Chi phí LT"} />
        </div>
        <div className="col-3">
          <h3 className="text-center">Chi phí ngân quỹ tích luỹ (BCWS)</h3>
          <LChart data={ltCongDonCostChartData} dataKey={"Chi phí LT"} />
        </div>
        <div className="col-3">
          <h3 className="text-center">Chi phí tích luỹ hàng tháng</h3>
          <BChart data={ttDaiLyCostChartData} dataKey={"Chi phí TT"} />
        </div>
        <div className="col-3">
          <h3 className="text-center">Chi phí thực tế (TT) tích luỹ (BCWS)</h3>
          <LChart data={ttCongDonCostChartData} dataKey={"Chi phí TT"} />
        </div>
      </div>
      {JSON.stringify(dataState)}
    </>
  );
};
