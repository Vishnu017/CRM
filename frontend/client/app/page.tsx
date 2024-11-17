import React from 'react';
import CustomerTable from './customerTable';
import OrderTable from './orderTable';

const App = () => {
  return (
    
    <div className="container mx-auto p-6">
      <CustomerTable />
      <OrderTable />
    </div>
  );
};

export default App;
