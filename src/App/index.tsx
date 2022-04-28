import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../Pages/Home";
import NewRoom from "../Pages/NewRoom";

import AuthContextProvider from "../contexts/AuthContextProvider";
import Room from "../Pages/Room";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
