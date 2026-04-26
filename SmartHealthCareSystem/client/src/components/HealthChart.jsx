import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, Legend
} from 'recharts';

const HealthChart = ({ parameters = [] }) => {
  if (!parameters || parameters.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-gray-400">
        <p>No health data available for visualization</p>
      </div>
    );
  }

  // Transform parameters for chart display
  const chartData = parameters.map(param => {
    const value = parseFloat(param.value) || 0;
    const rangeParts = (param.normalRange || '').split('-').map(v => parseFloat(v));
    const normalMin = rangeParts[0] || 0;
    const normalMax = rangeParts[1] || rangeParts[0] || 100;

    return {
      name: param.name.length > 15 ? param.name.substring(0, 15) + '...' : param.name,
      fullName: param.name,
      value,
      normalMin,
      normalMax,
      unit: param.unit,
      status: param.status
    };
  });

  const getBarColor = (status) => {
    switch (status) {
      case 'normal': return '#4ade80';
      case 'high': return '#f87171';
      case 'low': return '#fbbf24';
      case 'critical': return '#ef4444';
      default: return '#818cf8';
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-3 rounded-xl text-sm">
          <p className="font-semibold text-white">{data.fullName}</p>
          <p className="text-primary-300">Value: {data.value} {data.unit}</p>
          <p className="text-gray-400">Normal: {data.normalMin}-{data.normalMax} {data.unit}</p>
          <p className={`font-medium capitalize ${
            data.status === 'normal' ? 'text-success-400' : 'text-danger-400'
          }`}>Status: {data.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">📊 Health Parameters</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={50}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success-400" /> Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-danger-400" /> High</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning-400" /> Low</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-danger-500" /> Critical</span>
      </div>
    </div>
  );
};

export default HealthChart;
