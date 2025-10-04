import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAnalyticsData, getPostStatistics } from "../../firebase/dbService";
import AdminLayout from "./AdminLayout";

const COLORS = [
  "#3ABBD0",
  "#263D5D",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#F97316",
  "#EC4899",
];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    postsByCategory: [],
    postsByLocation: [],
    userGrowth: [],
    userStatusDistribution: {},
  });
  const [postStats, setPostStats] = useState({
    totalPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0,
    declinedPosts: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analytics, stats] = await Promise.all([
        getAnalyticsData(),
        getPostStatistics(),
      ]);
      setAnalyticsData(analytics);
      setPostStats(stats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-[#263D5D]">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Status distribution data for pie chart
  const statusDistributionData = [
    { name: "Pending", value: postStats.pendingPosts, color: "#F59E0B" },
    { name: "Approved", value: postStats.approvedPosts, color: "#10B981" },
    { name: "Declined", value: postStats.declinedPosts, color: "#EF4444" },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3ABBD0]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#263D5D] mb-2">Analytics</h1>
        <p className="text-gray-600">
          Comprehensive insights into your platform's performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#3ABBD0] to-cyan-400 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm">Total Posts</p>
            <Activity className="w-8 h-8 text-white/80" />
          </div>
          <h3 className="text-4xl font-bold">{postStats.totalPosts}</h3>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm">Approved</p>
            <Activity className="w-8 h-8 text-white/80" />
          </div>
          <h3 className="text-4xl font-bold">{postStats.approvedPosts}</h3>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm">Pending</p>
            <Activity className="w-8 h-8 text-white/80" />
          </div>
          <h3 className="text-4xl font-bold">{postStats.pendingPosts}</h3>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm">Declined</p>
            <Activity className="w-8 h-8 text-white/80" />
          </div>
          <h3 className="text-4xl font-bold">{postStats.declinedPosts}</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Over Time */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#263D5D] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            User Growth Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const [year, month] = value.split("-");
                  const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  return monthNames[parseInt(month) - 1];
                }}
              />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3ABBD0"
                strokeWidth={3}
                dot={{ fill: "#3ABBD0", r: 5 }}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Post Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#263D5D] mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Post Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {statusDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts by Category */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-[#263D5D] mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Posts by Category
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analyticsData.postsByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#666"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Posts" radius={[8, 8, 0, 0]}>
              {analyticsData.postsByCategory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Posts by Location (Top 10) */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-[#263D5D] mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Top 10 Locations by Posts
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analyticsData.postsByLocation} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#666" />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#666"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#263D5D"
              name="Posts"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
