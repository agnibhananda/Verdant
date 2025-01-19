import React from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface PlotlyChartProps {
  data: any[];
  layout?: Partial<Plotly.Layout>;
  title: string;
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({ data, layout = {}, title }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const defaultLayout: Partial<Plotly.Layout> = {
    title: title,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: 'Inter, sans-serif',
      color: '#2D5A27',
      size: 12
    },
    margin: { t: 20, r: 20, l: 50, b: 40 },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: 'white',
      font: { family: 'Inter, sans-serif', size: 12 },
      bordercolor: '#2D5A27'
    },
    ...layout
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    >
      <Plot
        data={data}
        layout={defaultLayout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{
          responsive: true,
          displayModeBar: false,
          showTips: false
        }}
      />
    </motion.div>
  );
};