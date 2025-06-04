
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/import" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">Import rapide</h2>
            <p className="text-gray-600 mb-4">Importez vos données de motos depuis des fichiers Excel</p>
            <div className="text-sm text-blue-500">Aller à l'importation &rarr;</div>
          </Link>
          <Link to="/motorcycles" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">Inventaire des motos</h2>
            <p className="text-gray-600 mb-4">Voir et gérer votre base de données de motos</p>
            <div className="text-sm text-blue-500">Voir les motos &rarr;</div>
          </Link>
          <Link to="/output" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">Options d'exportation</h2>
            <p className="text-gray-600 mb-4">Générez et téléchargez des rapports</p>
            <div className="text-sm text-blue-500">Export &rarr;</div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
