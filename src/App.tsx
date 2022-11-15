import React, { useState } from "react";
import "./index.css";
import "./second.css";
//@ts-ignore
import image from "./assets/jpg-image.jpg";

const App = () => {
  const [state, setState] = useState<number>(0);
  return (
    <div>
      <h1>{state}</h1>
      <button onClick={() => setState((prev) => prev + 1)}></button>
      <img src={image} alt="" />
    </div>
  );
};

export default App;
