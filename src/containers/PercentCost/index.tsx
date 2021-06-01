import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Row } from '../../screens';
import NumberPrecision from 'number-precision';
import { calculateBCWPCongDong } from '../../helpers';
import { CostSummary, LChart } from '../../components';
const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});
interface PercentCostProps {
    data: Row[];
    bcws: number[],
    acwp: number[],
    setDataState: (percent: any) => void;
    BAC?: number;
}
export const PercentCost = (props: PercentCostProps) => {
    const { data, bcws, acwp, setDataState, BAC } = props;
    const classes = useStyles();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const BCWPCongDon = calculateBCWPCongDong(data);

    const getPercentCostChartData = () => {
        const costChartData = [];

        for (let index = 0; index < 12; index++) {
            costChartData.push({
                name: `${index + 1}`,
                "Chi phí":
                    BCWPCongDon[index] !== 0 ? BCWPCongDon[index] : null,
            });

        }
        return [
            ...costChartData
        ];
    }

    return (
        <div>
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
                            <TableCell align="center">Trình tự</TableCell>
                            <TableCell align="center">Giá trị</TableCell>
                            {months.map((m, i) => (
                                <TableCell align="center">Tháng {i + 1}</TableCell>
                            ))}
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    <span style={{ width: "5px" }}>{index + 1}</span>
                                </TableCell>
                                <TableCell align="center">
                                    {data[index].name}
                                </TableCell>
                                <TableCell align="center">

                                    {
                                        <span style={{ width: "40px" }}>

                                            {data[index].months.map(m => m[0]).reduce((a, b) => (a + b), 0)}
                                        </span>
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    <span style={{ width: "40px" }}>
                                        {
                                            data[index].months.filter((month) => month[0] > 0).length
                                        }
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    {
                                        data[index].pred
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    <div style={{ color: "blue", fontWeight: "bold" }}>
                                        Phần trăm (%)
                                    </div>
                                    <div style={{ color: "blue", fontWeight: "bold" }}>
                                        Tiền
                                    </div>
                                </TableCell>
                                {row.percent.map((r, i) => (
                                    <TableCell align="center">
                                        <div>
                                            <input
                                                style={{
                                                    width: "60px",
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
                                                    // setDataState({ data });
                                                    let d = [...data];
                                                    let u = d[index];
                                                    const cost = u.months.map(m => m[0]).reduce((a, b) => (a + b), 0);
                                                    u.percent[i][0] = Number(e.target.value);
                                                    u.percent[i][1] = NumberPrecision.times(NumberPrecision.divide(Number(e.target.value), 100), Number(cost));
                                                    d[index] = u;
                                                    setDataState([...d]);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    width: "40px",
                                                    color: r[1] !== 0 ? "red" : "black",
                                                    border: "none",
                                                    textAlign: "center",
                                                    fontWeight: r[1] !== 0 ? "bold" : "normal",
                                                    backgroundColor: r[1] !== 0 ? "#d3f7ca" : "#fff",
                                                }}
                                            >
                                                {NumberPrecision.times(NumberPrecision.divide(Number(row.percent[i][0]), 100), Number(row.months.map(m => m[0]).reduce((a, b) => (a + b), 0)))}
                                            </span>
                                        </div>
                                    </TableCell>
                                ))}

                            </TableRow>
                        ))}
                        <TableRow>

                            <TableCell rowSpan={4} />
                            <TableCell align="right" colSpan={5}>

                                <span style={{ color: "blue", fontWeight: "bold" }}>

                                    BCWP Cộng dồn =
                                </span>
                            </TableCell>
                            {
                                BCWPCongDon.map((cost) => (
                                    <TableCell align="center">
                                        <span style={{ color: "blue", fontWeight: "bold" }}>
                                            {cost !== 0 ? cost.toFixed(2) : ""}
                                        </span>
                                    </TableCell>
                                ))

                            }
                        </TableRow>
                    </TableBody>;
                </Table>
            </TableContainer>
            <hr />
            <h1 className="text-center">Chi phí tích luỹ (BCWP)</h1>
            <div className="d-flex flex-row justify-content-center" style={{ padding: '0 25%' }}>
                <LChart data={getPercentCostChartData()} dataKey="Chi phí" />
            </div>
            <div>
                <CostSummary bcws={bcws} acwp={acwp} bcwp={BCWPCongDon} bac={BAC ?? 0} />
            </div>
        </div>
    )

}
