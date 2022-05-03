import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminRoom from "../Pages/AdminRoom";
import Home from "../Pages/Home";
import NewRoom from "../Pages/NewRoom";
import Room from "../Pages/Room";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/new" element={<NewRoom />} />
        <Route path="/rooms/:id" element={<Room />} />
        <Route path="/admin/rooms/:id" element={<AdminRoom />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
