import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./App.css";
import { EarnedValue2 } from "./screens";
import { EarnedValue } from "./screens/EarnedValue";

function App() {
  // const array_inputs = {
  //   1: 0,
  //   2: 0,
  //   3: 0,
  //   4: 0,
  //   5: 0,
  //   6: 0,
  //   7: 0,
  //   8: 0,
  //   9: 0,
  //   10: 0,
  //   11: 0,
  //   12: 0,
  // };
  // const [costLTState, setCostLTState] = useState(array_inputs);
  // const [costTTState, setCostTTState] = useState(array_inputs);

  // const renderCostLTInputs = () => {
  //   return Object.keys(array_inputs).map((key) => (
  //     <input
  //       type="text"
  //       onChange={(e) =>
  //         setCostLTState({
  //           ...costLTState,
  //           [key]: Number(Number(e.target.value)),
  //         })
  //       }
  //     />
  //   ));
  // };

  // useEffect(() => {
  //   const cost_lt_values = Object.values(costLTState);
  //   console.log(cost_lt_values);

  //   for (let i = 1; i < cost_lt_values.length; i++) {
  //     setCostTTState({
  //       ...costTTState,
  //       [i]: cost_lt_values[i] + cost_lt_values[i + 1],
  //     });
  //   }
  // }, [costLTState, costTTState]);

  // const [state, setState] = React.useState({
  //   ProjectName: "",
  //   BCWS: 0,
  //   BAC: 0,
  //   BCWP: 0,
  //   ACWP: 0,
  // });

  // const [calculatedState, setCalculatedState] = useState({
  //   CV: 0,
  //   SV: 0,
  //   CPI: 0,
  //   SPI: 0,
  //   CSI: 0,
  // });

  // const [isCalculated, setIsCalculated] = useState(false);

  // const handleCalculateValues = () => {
  //   setIsCalculated(true);
  //   setCalculatedState({
  //     ...calculatedState,
  //     CV: state.BCWP - state.ACWP,
  //     SV: state.BCWP - state.BCWS,
  //     CPI: state.BCWP / state.ACWP,
  //     SPI: state.BCWP / state.BCWS,
  //     CSI: state.BCWP / state.ACWP / (state.BCWP / state.BCWS),
  //   });
  // };

  // const handleResetValues = () => {
  //   setState({
  //     ProjectName: "",
  //     BCWS: 0,
  //     BAC: 0,
  //     BCWP: 0,
  //     ACWP: 0,
  //   });
  //   setCalculatedState({
  //     CV: 0,
  //     SV: 0,
  //     CPI: 0,
  //     SPI: 0,
  //     CSI: 0,
  //   });
  //   setIsCalculated(false);
  // };

  // return (
  //   <div className="container">
  //     <div>
  //       <h1 className="text-center">Earned Value Calculator</h1>
  //       <span>
  //         The Earned Value Calculator is a tool for project managers interested
  //         in having quantitative tracking information about their project
  //         status. It provides specific numerical measurements for reviewing
  //         progress as the software team advances through the work tasks allotted
  //         to the project schedule. All of the fields are required in this
  //         calculator and the BCWP, BAC, BCWS, and ACWP must be integers.
  //       </span>
  //     </div>
  //     <hr />
  //     <div>
  //       <div>
  //         <label>Enter Project Name:</label>
  //         <input
  //           type="text"
  //           value={state.ProjectName}
  //           autoFocus
  //           onChange={(e) =>
  //             setState({ ...state, ProjectName: e.target.value })
  //           }
  //         />
  //       </div>
  //       <div>
  //         <label>Enter Budgeted Cost of Work Scheduled (BCWS):</label>
  //         <input
  //           type="number"
  //           value={state.BCWS}
  //           onChange={(e) =>
  //             setState({ ...state, BCWS: Number(e.target.value) })
  //           }
  //         />
  //       </div>
  //       <div>
  //         <label>Enter Budgeted Cost Of Work Performed (BCWP):</label>
  //         <input
  //           type="number"
  //           value={state.BCWP}
  //           onChange={(e) =>
  //             setState({ ...state, BCWP: Number(e.target.value) })
  //           }
  //         />
  //       </div>
  //       <div>
  //         <label>Enter Actual Cost Of Work Performed (ACWP):</label>
  //         <input
  //           type="number"
  //           value={state.ACWP}
  //           onChange={(e) =>
  //             setState({ ...state, ACWP: Number(e.target.value) })
  //           }
  //         />
  //       </div>
  //       <div className="text-center">
  //         <Button variant="outline-primary" onClick={handleCalculateValues}>
  //           Calculate
  //         </Button>
  //         <Button variant="outline-secondary" onClick={handleResetValues}>Clear Values</Button>
  //       </div>
  //     </div>
  //     <hr />
  //     <div hidden={!isCalculated}>
  //       <h4>Your project is {state.ProjectName}</h4>
  //       <ul>
  //         <li>The Cost Variance (CV) is: {state.BCWP + " - " + state.ACWP} = {calculatedState.CV.toFixed(2)}</li>
  //         <li>The Schedule Variance (SV) is: {state.BCWP + " - " + state.BCWS} = {calculatedState.SV.toFixed(2)}</li>
  //         <li>The Cost Performance Index (CPI) is: {state.BCWP + "/" + state.ACWP} = {calculatedState.CPI.toFixed(2)}</li>
  //         <li>
  //           The Schedule Performance Index (SPI) is: {state.BCWP + "/" + state.BCWS} = {calculatedState.SPI.toFixed(2)}
  //         </li>
  //         <li>
  //           CSI is: "CPI / SPI" {calculatedState.CSI.toFixed(2)}{" "}
  //           {calculatedState.CSI > 1
  //             ? "> 1 (Project is accepted)"
  //             : "< 1 (Project has problem)"}
  //         </li>
  //       </ul>
  //     </div>
  //   </div>
  // );

  return <EarnedValue2 />;
}

export default App;
