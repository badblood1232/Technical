import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './login/login';
import Register from './login/register';
import CreateTrip from './trips/CreateTrip';
import TripList from './trips/TripList';
import TripDetail from './trips/TripDetail';
import MyTrips from './trips/MyTrips';
import RequireAuth from './RequireAuth';
import EditTrip from './trips/EditTrip';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={
          <RequireAuth><TripList /></RequireAuth>
        } />
        <Route path="/create-trip" element={
          <RequireAuth><CreateTrip /></RequireAuth>
        } />
        <Route path="/trips/:id" element={
          <RequireAuth><TripDetail /></RequireAuth>
        } />
        <Route path="/my-trips" element={
          <RequireAuth><MyTrips /></RequireAuth>
        } />
        <Route path="/trips/:id/edit" element={<EditTrip />} />

      </Routes>
    </Router>
  );
}

export default App;
