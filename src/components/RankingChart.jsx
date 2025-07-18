import React from 'react';
import ReactECharts from 'echarts-for-react';

const RankingChart = ({ period = '7d' }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Average Position', 'Top 3 Keywords', 'Map Pack Appearances']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Average Position',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          color: '#3B82F6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(59, 130, 246, 0.3)'
            }, {
              offset: 1, color: 'rgba(59, 130, 246, 0.1)'
            }]
          }
        },
        data: [3.2, 3.1, 2.9, 3.0, 2.8, 3.2, 3.1]
      },
      {
        name: 'Top 3 Keywords',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          color: '#10B981'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(16, 185, 129, 0.3)'
            }, {
              offset: 1, color: 'rgba(16, 185, 129, 0.1)'
            }]
          }
        },
        data: [120, 118, 125, 124, 127, 122, 124]
      },
      {
        name: 'Map Pack Appearances',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          color: '#8B5CF6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(139, 92, 246, 0.3)'
            }, {
              offset: 1, color: 'rgba(139, 92, 246, 0.1)'
            }]
          }
        },
        data: [85, 87, 89, 88, 91, 89, 89]
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Ranking Performance</h2>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
};

export default RankingChart;