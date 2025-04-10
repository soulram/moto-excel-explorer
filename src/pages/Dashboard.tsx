
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/import" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">Quick Import</h2>
            <p className="text-gray-600 mb-4">Import your motorcycle data from Excel files</p>
            <div className="text-sm text-blue-500">Go to Import &rarr;</div>
          </Link>
          <Link to="/motorcycles" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">Motorcycle Inventory</h2>
            <p className="text-gray-600 mb-4">View and manage your motorcycle database</p>
            <div className="text-sm text-blue-500">View Motorcycles &rarr;</div>
          </Link>
          <Link to="/output" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">Export Options</h2>
            <p className="text-gray-600 mb-4">Generate and download reports</p>
            <div className="text-sm text-blue-500">Output &rarr;</div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
