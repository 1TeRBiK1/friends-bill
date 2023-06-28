import Users from "./Components/Users/Users";
import DebtForm from "./Components/DebtForm/DebtForm";
import { Row, Col } from "antd";
import DebtHistory from "./Components/DebtHistory/DebtHistory";

function App() {
  return (
    <Row justify={'center'} style={{marginTop: '50px'}}>
      <Users />
      <DebtForm />
      <DebtHistory />
    </Row>
  );
}

export default App;
