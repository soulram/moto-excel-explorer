import mysql from 'mysql2/promise';

// Connection pool to MySQL database
export const createConnection = async () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ladmin61',
    database: 'immat',
  });
};

// Execute a query and return the result
export async function executeQuery({ query, values = [] }: { query: string; values?: any[] }) {
  try {
    const connection = await createConnection();
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to execute database query');
  }
}
