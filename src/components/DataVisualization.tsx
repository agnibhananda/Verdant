import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ChartProps {
  data: any[];
  type: 'line' | 'bar';
  dataKey: string;
  xAxisKey?: string;
  title: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  type,
  dataKey,
  xAxisKey = 'name',
  title
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={chartVariants}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
      role="region"
      aria-label={`${title} chart`}
    >
      <h3 className="text-lg font-semibold text-eco-primary mb-4">{title}</h3>
      <div className="h-[300px] w-full" role="img" aria-label={`${title} visualization`}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: '#2D5A27' }}
                aria-label="X axis"
              />
              <YAxis tick={{ fill: '#2D5A27' }} aria-label="Y axis" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F7F7F2',
                  border: '1px solid #2D5A27'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#8CB369"
                strokeWidth={2}
                dot={{ fill: '#2D5A27' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: '#2D5A27' }}
                aria-label="X axis"
              />
              <YAxis tick={{ fill: '#2D5A27' }} aria-label="Y axis" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#F7F7F2',
                  border: '1px solid #2D5A27'
                }}
              />
              <Legend />
              <Bar
                dataKey={dataKey}
                fill="#8CB369"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};