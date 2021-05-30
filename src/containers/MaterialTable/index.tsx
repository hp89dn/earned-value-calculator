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
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

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

export const MaterialTable = () => {
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
  }, [handleCalculate]);

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
        data.d.toString(),
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
    const ltsDaiLyData = ["Chi phí LT hằng ngày", "", "", "", ""];
    for (let index = 0; index < ltDaily.length; index++) {
      const element = ltDaily[index];
      ltsDaiLyData.push(element);
    }

    // chi phí lý thuyết cộng dồn
    const ltCongDon = costState[1].map((c) => (c !== 0 ? c.toString() : ""));
    const ltCongDonData = ["Chi phí LT cộng dồn", "", "", "", ""];
    for (let index = 0; index < ltCongDon.length; index++) {
      const element = ltCongDon[index];
      ltCongDonData.push(element);
    }

    // chi phí thực tế hằng ngày
    const ttDaily = costState[2].map((c) => (c !== 0 ? c.toString() : ""));
    const ttsDaiLyData = ["Chi phí LT hằng ngày", "", "", "", ""];
    for (let index = 0; index < ttDaily.length; index++) {
      const element = ttDaily[index];
      ttsDaiLyData.push(element);
    }

    // chi phí thực tế cộng dồn
    const ttCongDon = costState[3].map((c) => (c !== 0 ? c.toString() : ""));
    const ttCongDonData = ["Chi phí TT cộng dồn", "", "", "", ""];
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

    for (let i = 0; i < costRows.length; i++) {
      const element = costRows[i];
      data.push(element);
    }

    // create sheet and import data to sheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Merge cell: s = start, r = row, c=col, e= end
    const merge = [];
    // merge jobs columns
    for (let i = 1; i <= rows.length; i++) {
      merge.push(
        { s: { r: 2 * i - 1, c: 0 }, e: { r: 2 * i, c: 0 } },
        { s: { r: 2 * i - 1, c: 1 }, e: { r: 2 * i, c: 1 } },
        { s: { r: 2 * i - 1, c: 2 }, e: { r: 2 * i, c: 2 } },
        { s: { r: 2 * i - 1, c: 3 }, e: { r: 2 * i, c: 3 } },
        { s: { r: 2 * i - 1, c: 4 }, e: { r: 2 * i, c: 4 } }
      );
    }

    const i = 2 * rows.length + 1;
    // merge cost column
    merge.push(
      { s: { r: i, c: 0 }, e: { r: i, c: 4 } },
      { s: { r: i + 1, c: 0 }, e: { r: i + 1, c: 4 } },
      { s: { r: i + 2, c: 0 }, e: { r: i + 2, c: 4 } },
      { s: { r: i + 3, c: 0 }, e: { r: i + 3, c: 4 } }
    );
    // let's merge cell
    ws["!merges"] = merge;

    // create workbook
    const wb = XLSX.utils.book_new();
    //append sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  return (
    <>
      <TableContainer>
        <Table
          className={classes.table}
          style={{ width: "100%" }}
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
                    <input
                      type="number"
                      style={{ width: "40px" }}
                      placeholder=""
                      value={dataState[index].d}
                      onChange={(e) => {
                        const data = [...dataState];
                        data[index].d = Number(e.target.value);
                        setDataState([...data]);
                      }}
                    />
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
                  {row.type.map((t) => (
                    <div>{t}</div>
                  ))}
                </TableCell>
                {row.months.map((r, i) => (
                  <TableCell align="center">
                    <div>
                      <input
                        style={{ width: "40px" }}
                        type="number"
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
                        style={{ width: "40px" }}
                        type="number"
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
                Chi phí LT hằng ngày
              </TableCell>
              {costState && costState[0]
                ? costState[0].map((cost) => (
                    <TableCell align="center">{cost}</TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                Chi phí LT cộng dồn
              </TableCell>
              {costState && costState[0]
                ? costState[1].map((cost) => (
                    <TableCell align="center">{cost}</TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                Chi phí TT hằng ngày
              </TableCell>
              {costState && costState[0]
                ? costState[2].map((cost) => (
                    <TableCell align="center">{cost}</TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={4}>
                Chi phí TT cộng dồn
              </TableCell>
              {costState && costState[0]
                ? costState[3].map((cost) => (
                    <TableCell align="center">{cost}</TableCell>
                  ))
                : ""}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <hr />
      <div>
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
      </div>
      {JSON.stringify(dataState)}
    </>
  );
};
