const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Overview</h3>
          <p className="text-gray-600">Welcome to your dashboard overview.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
          <p className="text-gray-600">No recent activity found.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Stats</h3>
          <p className="text-gray-600">Your stats will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
