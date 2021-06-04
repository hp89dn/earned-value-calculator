import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button, IconButton, Input } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import api from "../../api/index";
import { ToastContainer, toast } from "react-toastify";

import {
  calculateLTCD,
  calculateLTCost,
  calculateTTCost,
  calculateTTTCD,
  getCosts,
  getJobRowExcelData,
} from "../../helpers";
import * as XLSX from "xlsx";
import { BChart, LChart } from "../../components";
import { PercentCost } from "../../containers";
import NumberPrecision from "number-precision";
import { useHistory } from "react-router";
import { SaveOutlined } from "@material-ui/icons";
NumberPrecision.enableBoundaryChecking(false); // default param is true

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export interface Row {
  name: string;
  cost: number;
  percent: number[][];
  d: number;
  pred: string;
  type: string[];
  months: number[][];
}

const initialRow: Row = {
  name: "",
  cost: 0,
  d: 0,
  type: ["LT", "TT"],
  pred: "-",
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
  percent: [
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
interface EarnedValueScreenProps {
  project_name: string;
  data: Row[];
  uid: string;
  item_id: string;
}
export const EarnedValueScreen = (props: EarnedValueScreenProps) => {
  const classes = useStyles();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const [projectNameState, setProjectNameState] = useState(
    props.project_name || ""
  );
  const [dataState, setDataState] = useState<Row[]>(props.data);
  const rows: Row[] = JSON.parse(JSON.stringify(dataState));
  const [costState, setCostState] = useState<number[][]>([]);
  const [costLTCDState, setCostCDState] = useState<number[]>([]);
  React.useEffect(() => {
    const ltCost = calculateLTCost(dataState);
    const ltCDCost = calculateLTCD(ltCost);
    const ttCost = calculateTTCost(dataState);
    const ttCDCost = calculateTTTCD(ttCost);
    const cost = [[...ltCost], [...ltCDCost], [...ttCost], [...ttCDCost]];
    setCostCDState(ltCDCost);
    setCostState(JSON.parse(JSON.stringify(cost)));
  }, [dataState]);
  const notifyUpdateSuccess = () => toast("Lưu thành công");
  const notifyUpdateError = () => toast("Lưu thất bại");

  const { uid, item_id } = props;

  const handleSave = () => {
    const updatedData = {
      project_name: projectNameState,
      data: JSON.stringify(dataState),
      uid: uid,
      id: item_id,
    };
    api
      .put("api/admin/update", updatedData)
      .then((response) => {
        notifyUpdateSuccess();
      })
      .catch(() => {
        notifyUpdateError();
      });
  };

  const handleDeleteRow = (i: number): void => {
    const datas = JSON.parse(JSON.stringify(dataState));
    const newArray = [...datas].filter((data, index) => index !== i);
    setDataState([]);
    setDataState([...newArray]);
  };
  const notifyDeleteSuccess = () => toast("Xoá thành công");
  const notifyDeleteError = () => toast("Xoá thất bại");
  const history = useHistory();
  const handleDeleteItem = () => {
    const newData = {
      uid: uid,
      id: item_id,
    };
    api
      .post(
        `api/admin/delete/uid=${String(uid)}}/id=${String(item_id)}`,
        newData
      )
      .then((response) => {
        notifyDeleteSuccess();
        history.push("/dashboard");
      })
      .catch(() => {
        notifyDeleteError();
      });
  };

  const handleExportExcel = () => {
    const headers = [
      "STT",
      "Công việc",
      "Chi phí",
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
    const rows = getJobRowExcelData(dataState);

    // push job data to data array
    const data = [[...headers]];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      for (let i = 0; i < row.length; i++) {
        const element = row[i];
        data.push(element);
      }
    }
    const costRows = getCosts(costState);

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
    merge.push({ s: { r: i, c: 0 }, e: { r: i, c: 17 } });
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
            cost: data[i]["Chi phí"],
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
            percent: [
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
        name: `${index + 1}`,
        "Chi phí LT":
          costState[0] && costState[0][index] !== 0
            ? costState[0][index]
            : null,
      });
      ltCongDonCost.push({
        name: `${index + 1}`,
        "Chi phí LT":
          costState[1] && costState[1][index] !== 0
            ? costState[1][index]
            : null,
      });
      ttDaiLyCost.push({
        name: `${index + 1}`,
        "Chi phí TT":
          costState[2] && costState[2][index] !== 0
            ? costState[2][index]
            : null,
      });
      ttCongDonCost.push({
        name: `${index + 1}`,
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
      [...ttCongDonCost],
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
      <div className="d-flex flex-row flex-wrap">
        <div>
          <label>Tên Dự Án: </label>
          <Input
            style={{ marginLeft: "1rem" }}
            placeholder="Nhập Tên Dự Án"
            type="text"
            value={projectNameState}
            onChange={(e) => setProjectNameState(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: "1rem" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            component="label"
          >
            <SaveOutlined /> Lưu
          </Button>
          <Button
            onClick={handleDeleteItem}
            variant="contained"
            color="secondary"
            component="label"
            style={{ marginLeft: "1rem" }}
          >
            <DeleteIcon /> Xoá
          </Button>
        </div>
      </div>
      <hr />
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
              <TableCell align="center">Chi phí</TableCell>
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
                      const data = JSON.parse(JSON.stringify(dataState));
                      data[index].name = e.target.value;
                      setDataState([...data]);
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  {
                    <span style={{ width: "40px" }}>
                      {dataState[index].months
                        .map((month) => month[0])
                        .reduce((a, b) => a + b, 0)}
                    </span>
                  }
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
                        const data = JSON.parse(JSON.stringify(dataState));
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
                          const cost = data[index].months
                            .map((m: any) => m[0])
                            .reduce((a: number, b: number) => a + b, 0);
                          data[index].percent[i][1] = NumberPrecision.times(
                            NumberPrecision.divide(
                              data[index].percent[i][0],
                              100
                            ),
                            Number(cost)
                          );
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
                          const data = JSON.parse(JSON.stringify(dataState));
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
              <TableCell align="right" colSpan={5}>
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
              <TableCell align="right" colSpan={5}>
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  Chi phí LT cộng dồn
                </span>
              </TableCell>
              {costLTCDState
                ? costLTCDState.map((cost) => (
                    <TableCell align="center">
                      <span style={{ color: "blue", fontWeight: "bold" }}>
                        {cost !== 0 ? cost : ""}
                      </span>
                    </TableCell>
                  ))
                : ""}
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={5}>
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
              <TableCell align="right" colSpan={5}>
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
          onClick={() => setDataState(dataState.concat(initialRow))}
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
        {" "}
        <div className="col-3">
          {" "}
          <h3 className="text-center">Chi phí ngân quỹ hàng tháng</h3>{" "}
          <BChart data={ltDaiLyCostChartData} dataKey={"Chi phí LT"} />{" "}
        </div>{" "}
        <div className="col-3">
          {" "}
          <h3 className="text-center">Chi phí ngân quỹ tích luỹ (BCWS)</h3>{" "}
          <LChart data={ltCongDonCostChartData} dataKey={"Chi phí LT"} />{" "}
        </div>{" "}
        <div className="col-3">
          {" "}
          <h3 className="text-center">Chi phí tích luỹ hàng tháng</h3>{" "}
          <BChart data={ttDaiLyCostChartData} dataKey={"Chi phí TT"} />{" "}
        </div>{" "}
        <div className="col-3">
          {" "}
          <h3 className="text-center">
            Chi phí thực tế (TT) tích luỹ (BCWS)
          </h3>{" "}
          <LChart data={ttCongDonCostChartData} dataKey={"Chi phí TT"} />{" "}
        </div>{" "}
      </div>
      <PercentCost
        BAC={costState && costState[1] ? costState[1].pop() : 0}
        data={dataState}
        bcws={costLTCDState}
        acwp={costState[3]}
        setDataState={setDataState}
      />
      <ToastContainer />
    </>
  );
};
