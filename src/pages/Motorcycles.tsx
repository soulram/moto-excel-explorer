
import React from 'react';
import Layout from '@/components/Layout';
import MotorcycleList from '@/components/MotorcycleList';

const Motorcycles = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Motorcycle List</h1>
        <MotorcycleList />
      </div>
    </Layout>
  );
};

export default Motorcycles;
