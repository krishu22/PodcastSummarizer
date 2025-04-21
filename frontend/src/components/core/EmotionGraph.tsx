import React from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { EmotionData } from '../../schemas/emotion-types';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  data: EmotionData[];
}

const getColor = (emotion: string) => {
  const colorMap: Record<string, string> = {
    joy: "#facc15",
    anger: "#ef4444",
    sadness: "#3b82f6",
    fear: "#8b5cf6",
    surprise: "#10b981",
    disgust: "#a3e635",
    neutral: "#9ca3af",
  };
  return colorMap[emotion] || "#000";
};

const EmotionGraph: React.FC<Props> = ({ data }) => {
  const emotions = ["joy", "anger", "sadness", "fear", "surprise", "disgust", "neutral"];

  const labels = data.map(d => (d.start + d.end) / 2);

  const datasets = emotions.map(emotion => ({
    label: emotion,
    data: data.map(d => {
      const e = d.emotions.find(e => e.label === emotion);
      return e ? e.score : 0;
    }),
    borderColor: getColor(emotion),
    fill: false,
  }));

  return (
    <div className='w-full p-4 bg-white rounded-xl shadow-lg'>
      <Line
        key={JSON.stringify(data)} // Forces a remount on data change
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        }}
      />
    </div>
  );
};

export default EmotionGraph;
