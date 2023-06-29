import { Row, Card, Space, Spin, Modal } from "antd";
import { useEffect, useState } from "react";
import http from "../../../../Axios/http";
import { IDebtHistory } from "../../../../Types/DebtHistory";
import { DeleteOutlined } from "@ant-design/icons";

export function formatDate(date: Date) {
  const newDate = new Date(date);
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const year = String(newDate.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

const DebtHistory: React.FC<{
  setReset: (prev: number) => void;
  reset: number;
}> = ({ setReset, reset }) => {
  const [debtHistory, setDebtHistory] = useState<IDebtHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalState, setModalState] = useState<IDebtHistory>({
    _id: 0,
    creditor: "creditor",
    debtors: [],
    amount: 0,
    date: new Date(),
    description: "description",
  });

  const handleDeleteOnClick = (id: number) => {
    setLoading(true);
    http
      .delete("/debts/" + id)
      .then((res) => {
        setLoading(false);
        getDebtHistory();
      })
      .then(() => setReset(new Date().getMilliseconds()));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (id: number) => {
    handleDeleteOnClick(id);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getDebtHistory = () => {
    http
      .get<IDebtHistory[]>("/debts")
      .then((res) => setDebtHistory(res.data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDebtHistory();
  }, [reset]);

  return (
    <>
      {error ? error : null}
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
              key={e._id}
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
                    onClick={() => {
                      setModalState(e);
                      showModal();
                    }}
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
                    <Row key={e.name}>
                      {e.name} : {e.amount.toFixed(2) + " BYN"}
                    </Row>
                  ))}
                </Row>
              </Card>
            </Row>
          ))}
          <Modal
            title={"Если проебался - удаляй!"}
            open={isModalOpen}
            okText="Delete"
            onOk={() => handleOk(modalState._id)}
            onCancel={handleCancel}
            cancelText="Cancel"
          >
            <p>Описание: {modalState?.description}</p>
            <p>Кто платил: {modalState?.creditor}</p>
            <p>Сумма: {modalState?.amount}</p>
            <p>Дата: {formatDate(modalState?.date)}</p>
            <p
              style={{
                flexDirection: "column",
              }}
            >
              <p>Кому оплатили:</p>
              {modalState?.debtors.map((e) => (
                <p key={e.name}>
                  {e.name} : {e.amount.toFixed(2) + " BYN"}
                </p>
              ))}
            </p>
          </Modal>
        </Row>
      </Row>
    </>
  );
};

export default DebtHistory;
