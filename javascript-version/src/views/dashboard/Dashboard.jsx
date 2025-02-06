// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { useHistory } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
  const [role, setRole] = useState(null);  // To store role (Customer or Agent)
  const history = useHistory();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);  // Get user document from Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role); // 'customer' or 'agent'
        }
      }
    };

    checkUserRole();
  }, []);

  // Redirect based on role
  useEffect(() => {
    if (role === 'customer') {
      history.push('/customer-dashboard');
    } else if (role === 'agent') {
      history.push('/agent-dashboard');
    }
  }, [role, history]);

  return <div>Loading...</div>;  // Show loading state while checking role
};

export default Dashboard;
