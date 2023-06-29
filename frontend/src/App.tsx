import Users from "./Components/Users/Users";
import DebtForm from "./Components/Tab/Debt/DebtForm/DebtForm";
import { Row, Col } from "antd";
import DebtHistory from "./Components/Tab/Debt/DebtHistory/DebtHistory";
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
