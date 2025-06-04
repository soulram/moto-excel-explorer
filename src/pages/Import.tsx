
import React from 'react';
import Layout from '@/components/Layout';
import ExcelImporter from '@/components/ExcelImporter';

const Import = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Importer Excel</h1>
        <ExcelImporter />
      </div>
    </Layout>
  );
};

export default Import;
