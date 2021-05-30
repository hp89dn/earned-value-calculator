// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import { ModalContainer, ReactTable, MaterialTable } from "../../containers";
// import {
//   calculateLTCD,
//   calculateLTCost,
//   calculateTTCost,
//   calculateTTTCD,
// } from "../../helpers";

// import { test1 } from "../../data/test";

// import { columns } from "./columns";

// export const EarnedValue = () => {
//   const [dataState, setDataState] = useState(test1);

//   const handleDeleteRow = (i: number) => {
//     const datas = JSON.parse(JSON.stringify(dataState));
//     const newArray = [...datas].filter((data, index) => index !== i);
//     setDataState([]);
//     setDataState([...newArray]);
//   };

//   const renderInput = (
//     i: number,
//     index: number,
//     ltValue: number,
//     ttValue: number
//   ) => {
//     return (
//       <div>
//         <div>
//           <input
//             type="number"
//             value={ltValue}
//             min={0}
//             onChange={(e) => {
//               const data = [...dataState];
//               switch (index) {
//                 case 0:
//                   data[i].month1.lt = Number(e.target.value);
//                   break;
//                 case 1:
//                   data[i].month2.lt = Number(e.target.value);
//                   break;
//                 case 2:
//                   data[i].month3.lt = Number(e.target.value);
//                   break;
//                 case 3:
//                   data[i].month4.lt = Number(e.target.value);
//                   break;
//                 case 4:
//                   data[i].month5.lt = Number(e.target.value);
//                   break;
//                 case 5:
//                   data[i].month6.lt = Number(e.target.value);
//                   break;
//                 case 6:
//                   data[i].month7.lt = Number(e.target.value);
//                   break;
//                 case 7:
//                   data[i].month8.lt = Number(e.target.value);
//                   break;
//                 case 8:
//                   data[i].month9.lt = Number(e.target.value);
//                   break;
//                 case 9:
//                   data[i].month10.lt = Number(e.target.value);
//                   break;
//                 case 10:
//                   data[i].month11.lt = Number(e.target.value);
//                   break;
//                 case 11:
//                   data[i].month12.lt = Number(e.target.value);
//                   break;
//                 default:
//                   break;
//               }
//               console.log(data);

//               setDataState(data);
//             }}
//           />
//         </div>
//         <div>
//           <input
//             type="number"
//             value={ttValue}
//             min={0}
//             onChange={(e) => {
//               const data = [...dataState];
//               switch (index) {
//                 case 0:
//                   data[i].month1.tt = Number(e.target.value);
//                   break;
//                 case 1:
//                   data[i].month2.tt = Number(e.target.value);
//                   break;
//                 case 2:
//                   data[i].month3.tt = Number(e.target.value);
//                   break;
//                 case 3:
//                   data[i].month4.tt = Number(e.target.value);
//                   break;
//                 case 4:
//                   data[i].month5.tt = Number(e.target.value);
//                   break;
//                 case 5:
//                   data[i].month6.tt = Number(e.target.value);
//                   break;
//                 case 6:
//                   data[i].month7.tt = Number(e.target.value);
//                   break;
//                 case 7:
//                   data[i].month8.tt = Number(e.target.value);
//                   break;
//                 case 8:
//                   data[i].month9.tt = Number(e.target.value);
//                   break;
//                 case 9:
//                   data[i].month10.tt = Number(e.target.value);
//                   break;
//                 case 10:
//                   data[i].month11.tt = Number(e.target.value);
//                   break;
//                 case 11:
//                   data[i].month12.tt = Number(e.target.value);
//                   break;
//                 default:
//                   break;
//               }
//               setDataState(data);
//             }}
//           />
//         </div>
//       </div>
//     );
//   };

//   const tableDatas = dataState.map((data, i) => {
//     return {
//       ...data,
//       id: i + 1,
//       type: data.type.map((t: string) => <div>{t}</div>),
//       month1: renderInput(i, 0, data.month1.lt, data.month1.tt),
//       month2: renderInput(i, 1, data.month2.lt, data.month2.tt),
//       month3: renderInput(i, 2, data.month3.lt, data.month3.tt),
//       month4: renderInput(i, 3, data.month4.lt, data.month4.tt),
//       month5: renderInput(i, 4, data.month5.lt, data.month5.tt),
//       month6: renderInput(i, 5, data.month6.lt, data.month6.tt),
//       month7: renderInput(i, 6, data.month7.lt, data.month7.tt),
//       month8: renderInput(i, 7, data.month8.lt, data.month8.tt),
//       month9: renderInput(i, 8, data.month9.lt, data.month9.tt),
//       month10: renderInput(i, 9, data.month10.lt, data.month10.tt),
//       month11: renderInput(i, 10, data.month11.lt, data.month11.tt),
//       month12: renderInput(i, 11, data.month12.lt, data.month12.tt),
//       action: (
//         <button
//           type="button"
//           className="btn btn-danger"
//           onClick={() => handleDeleteRow(i)}
//         >
//           Xoá
//         </button>
//       ),
//     };
//   });

//   const handleAddJob = () => {
//     if (jobTitleState) {
//       setDataState([
//         ...dataState,
//         {
//           name: jobTitleState,
//           d: 0,
//           pred: "-",
//           type: ["LT", "TT"],
//           month1: { lt: 0, tt: 0 },
//           month2: { lt: 0, tt: 0 },
//           month3: { lt: 0, tt: 0 },
//           month4: { lt: 0, tt: 0 },
//           month5: { lt: 0, tt: 0 },
//           month6: { lt: 0, tt: 0 },
//           month7: { lt: 0, tt: 0 },
//           month8: { lt: 0, tt: 0 },
//           month9: { lt: 0, tt: 0 },
//           month10: { lt: 0, tt: 0 },
//           month11: { lt: 0, tt: 0 },
//           month12: { lt: 0, tt: 0 },
//         },
//       ]);
//       setJobTitleState("");
//     }
//   };

//   const [jobTitleState, setJobTitleState] = useState("");

//   const [modalState, setModelState] = useState(false);
//   const [costState, setCostState] = useState<number[][]>();
//   const handleCalculate = () => {
//     const ltCost = calculateLTCost(dataState);
//     const ltCDCost = calculateLTCD(ltCost);
//     const ttCost = calculateTTCost(dataState);
//     const ttCDCost = calculateTTTCD(ttCost);
//     const cost = [[...ltCost], [...ltCDCost], [...ttCost], [...ttCDCost]];
//     setCostState(cost);
//     setModelState(true);
//   };

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col-12"><MaterialTable /></div>
//       </div>
//       <div className="row">
//         <div className="col-12">
//           <ReactTable columns={columns} data={tableDatas} />
//         </div>
//       </div>
//       <div className="d-flex justify-content-center">
//         <div className="d-flex justify-content-center">
//           <input
//             className="form-control"
//             value={jobTitleState}
//             onChange={(e) => setJobTitleState(e.target.value)}
//           />

//           <Button className="text-center" type="primary" onClick={handleAddJob}>
//             Thêm Công việc
//           </Button>
//         </div>
//       </div>
//       <hr />
//       <div className="d-flex justify-content-center">
//         <Button
//           className="text-center"
//           type="primary"
//           onClick={handleCalculate}
//         >
//           Tính Earned Value
//         </Button>
//       </div>
//       {JSON.stringify(dataState)}
//       <ModalContainer
//         show={modalState}
//         handleClose={() => setModelState(false)}
//         costs={costState}
//       />
//     </div>
//   );
// };

import React from "react";

export const EarnedValue = () => {
  return <div></div>;
};
