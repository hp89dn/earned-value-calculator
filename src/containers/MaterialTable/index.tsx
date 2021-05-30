import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { test1 } from "../../data/test";
import { Button } from "@material-ui/core";
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

  const [costState, setCostState] = useState<number[][]>();

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

  const dataExport = []

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
                <TableCell align="center">{i + 1}</TableCell>
              ))}
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
      </div>
      {JSON.stringify(costState)}
    </>
  );
};
