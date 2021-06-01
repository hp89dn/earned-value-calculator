import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine
} from "recharts";

interface AreaChartProps {
  data: any;
}
export const CostSumChart = (props: AreaChartProps) => {
  const { data } = props;
  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" aspect={2 / 1}>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
          <Line
            type="monotone"
            dataKey="BCWS"
            stroke="blue"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="ACWP"
            stroke="pink"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="BCWP"
            stroke="green"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <span className="text-danger" style={{ position: 'absolute', content: '', bottom: '50px', right: '-80px', fontWeight: 'bold', padding: '5px 10px', backgroundColor: 'lightgreen' }}>Tháng</span>
      <span className="text-danger" style={{ position: 'absolute', content: '', top: '0', left: '-30px', fontWeight: 'bold', padding: '5px 10px', backgroundColor: 'lightgreen' }}>USD</span>
    </div>
  );
};
