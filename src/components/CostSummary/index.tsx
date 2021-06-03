import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableRow, makeStyles } from '@material-ui/core';
import { CostSumChart } from '../CostSumChart';
import NumberPrecision from 'number-precision';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

interface CostSummaryProps {
    bcws: number[];
    acwp: number[];
    bcwp: number[];
    bac: number;
}
export const CostSummary = (props: CostSummaryProps) => {
    const classes = useStyles();
    const { bcws, acwp, bcwp, bac } = props;
    const data = [];
    for (let i = 0; i < 12; i++) {
        data.push({
            name: (i + 1),
            BCWS: bcws && bcws[i] !== 0 ? bcws[i] : null,
            ACWP: acwp && acwp[i] !== 0 ? acwp[i] : null,
            BCWP: bcwp && bcwp[i] !== 0 ? bcwp[i] : null,
        })
    }
    const BCWS = bcws ? Number(bcws.filter(b => b > 0).pop()).toFixed(2) : 0;
    const ACWP = acwp ? Number(acwp.filter(b => b > 0).pop()).toFixed(2) : 0;
    const BCWP = bcwp ? Number(bcwp.filter(b => b > 0).pop()).toFixed(2) : 0;
    const CPI = NumberPrecision.divide(BCWP, ACWP).toFixed(2);
    const SPI = NumberPrecision.divide(BCWP, BCWS).toFixed(2);
    const CV = NumberPrecision.minus(BCWP, ACWP).toFixed(2);
    const SV = NumberPrecision.minus(BCWP, BCWS).toFixed(2);
    const BAC = bac.toFixed(2);
    const ETC = NumberPrecision.divide(NumberPrecision.minus(BAC, BCWP), CPI).toFixed(2);
    const EAC = NumberPrecision.plus(ACWP, ETC).toFixed(2);

    return (
        <div>
            <TableContainer>
                <Table
                    className={classes.table}
                    style={{ width: "100%", backgroundColor: "#e9ecef" }}
                    aria-label="spanning table"
                >
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">Chi phí BCWS cộng dồn</TableCell>
                            {
                                bcws ? bcws.map(x => <TableCell align="center">{x !== 0 ? x.toFixed(2) : ""} </TableCell>) : ""
                            }
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">Chi phí ACWP cộng dồn</TableCell>
                            {
                                acwp ? acwp.map(x => <TableCell align="center">{x !== 0 ? x.toFixed(2) : ""}</TableCell>) : ""
                            }
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">Chi phí BCWP cộng dồn</TableCell>
                            {
                                bcwp ? bcwp.map(x => <TableCell align="center">{x !== 0 ? x.toFixed(2) : ""}</TableCell>) : ""
                            }
                        </TableRow>
                    </TableBody>;
                </Table>
            </TableContainer>
            <h1 className="text-center">Biểu đồ tổng hợp BCWS - ACWP - BCWP</h1>

            <div className="row">
                <div className="col-6" style={{ padding: '0 5%' }}>
                    <CostSumChart data={data} />
                </div>
                <div className="col-6">
                    <ul>
                        <li>
                            ACWP = {ACWP}
                        </li>
                        <li>
                            BCWS = {BCWS}
                        </li>
                        <li>
                            BCWP = {BCWP}
                        </li>
                        <li>
                            CPI = BCWP / ACWP = {BCWP} / {ACWP} = {CPI} {Number(CPI) < 1 ? " < 1 => Vượt chi phí" : ">= 1 => Không vượt chi phí"}
                        </li>
                        <li>
                            SPI = BCWP / BCWS = {BCWP} / {BCWS} = {SPI} {Number(SPI) < 1 ? " < 1 => Chậm tiến độ" : " >= 1 => Kịp tiến độ"}
                        </li>
                        <li>
                            CV = BCWP - ACWP = {BCWP} - {ACWP} = {CV}
                        </li>
                        <li>
                            SV = BCWP - BCWS = {BCWP} - {BCWS} = {SV}
                        </li>
                        <li>
                            ETC = (BAC - BCWP) / CPI = ({BAC} - {BCWP}) / {CPI} = {ETC}
                        </li>
                        <li>
                            EAC = ACWP + ETC = {ACWP} + {ETC} = {EAC}
                        </li>
                    </ul>
                    <span className="text-info font-weight-bold">** Chú thích:</span>
                    <ul>
                        <li> BAC: Cả công trình</li>
                        <li>ETC: Chi phí ước tính để làm hết phần còn lại</li>
                        <li>EAC: Chi phí tổng cộng ước tính để hoàn tất = Chi phí thực tế + Chi phí ước tính để hoàn tất phần còn lại
                        </li>
                    </ul>


                </div>
            </div>
        </div>
    )
}
