'use client'
import React, { useEffect, useState } from 'react';
import CustomerTable from './customerTable';
import OrderTable from './orderTable';
import keycloak from './keycloak/index';

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(auth => {
      setAuthenticated(auth);
    });
  }, []);
  console.log("keycloak!.tokenParsed")
  console.log(keycloak!.tokenParsed)
  return (
    
    <div className="container mx-auto p-6">
      <CustomerTable />
      <OrderTable />
      <div className="mt-4">
        <button
          onClick={() => window.location.href = "http://localhost:3000/campaigns"}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Go to Campaigns Page
        </button>
      </div>
    </div>
  );
};

export default App;
