import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../Pages/Home";
import NewRoom from "../Pages/NewRoom";

import AuthContextProvider from "../contexts/AuthContextProvider";

const App = () => {


  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
