import { Row, Card, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import http from "../../Axios/http";
import { IDebtHistory } from "../../Types/DebtHistory";
import { DeleteOutlined } from "@ant-design/icons";

function formatDate(date: Date) {
  const newDate = new Date(date);
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const year = String(newDate.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

const DebtHistory: React.FC = () => {
  const [debtHistory, setDebtHistory] = useState<IDebtHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    http
      .get<IDebtHistory[]>("/debts")
      .then((res) => setDebtHistory(res.data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading ? (
        <Space direction="vertical" style={{ width: "100%", marginTop: 40 }}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Space>
      ) : null}
      <Row
        style={{
          marginTop: "40px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Row>History: </Row>
        <Row
          style={{
            marginTop: "10px",
          }}
        >
          {debtHistory.map((e) => (
            <Row
              style={{
                marginTop: "10px",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Card
                title={e.description}
                bordered={true}
                style={{
                  background: "rgb(40, 255, 255)",
                  width: "50%",
                  minWidth: 300,
                }}
                actions={[
                  <DeleteOutlined
                    key="delete"
                    onClick={() => console.log("delete")}
                  />,
                ]}
              >
                <Row>Кто платил: {e.creditor}</Row>
                <Row>Сумма: {e.amount}</Row>
                <Row>Дата: {formatDate(e.date)}</Row>
                <Row
                  style={{
                    flexDirection: "column",
                  }}
                >
                  <Row>Кому оплатили:</Row>
                  {e.debtors.map((e) => (
                    <Row>
                      {e.name} : {e.amount + " BYN"}
                    </Row>
                  ))}
                </Row>
              </Card>
            </Row>
          ))}
        </Row>
      </Row>
    </>
  );
};

export default DebtHistory;
