import Users from "./Components/Users/Users";
import DebtForm from "./Components/DebtForm/DebtForm";
import { Row, Col } from "antd";
import DebtHistory from "./Components/DebtHistory/DebtHistory";
import { useState } from "react";

function App() {
  const [reset, setReset] = useState(0);

  return (
    <Row
      justify={"center"}
      style={{ marginTop: "50px", flexDirection: "column" }}
    >
      <Users />
      <DebtForm setReset={setReset}/>
      <DebtHistory />
    </Row>
  );
}

export default App;
