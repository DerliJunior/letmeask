import React from "react";

import Routers from "../Routes/routers";

import AuthContextProvider from "../contexts/AuthContextProvider";

const App = () => {
  return (
      <AuthContextProvider>
        <Routers/>
      </AuthContextProvider>

  );
};

export default App;
