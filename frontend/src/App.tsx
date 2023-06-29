import Users from "./Components/Users/Users";
import { Row } from "antd";
import { useState } from "react";
import Tab from "./Components/Tab/Tab";

function App() {
  const [reset, setReset] = useState(0);

  return (
    <Row
      justify={"center"}
      style={{ marginTop: "50px", flexDirection: "column" }}
    >
      <Users reset={reset} />
      <Tab setReset={setReset} reset={reset} />
    </Row>
  );
}

export default App;
