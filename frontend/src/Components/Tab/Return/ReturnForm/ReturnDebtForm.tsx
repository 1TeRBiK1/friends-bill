import { useState } from "react";
import { Row, Modal, Space, Spin } from "antd";
import { Form, Select, DatePicker, Button, InputNumber } from "antd";
import http from "../../../../Axios/http";
import { formatDate } from "../../Debt/DebtHistory/DebtHistory";
import { IReturnDebtHistory } from "../../../../Types/ReturnDebtHistory";
const { Option } = Select;

const NAMES = ["Nikita", "Oleg", "Maks"];

interface ReturnDebtFormProps {
  setReset: (prev: number) => void;
}

const ReturnDebtForm: React.FC<ReturnDebtFormProps> = ({ setReset }) => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState<IReturnDebtHistory>({
    _id: 0,
    debtor: "creditor",
    creditors: [],
    date: new Date(),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    http.post("/debts/return-debt", modalState).then(() => {
      setLoading(false);
      setReset(new Date().getMilliseconds());
    });
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    const newValues = { ...values, date: values.date.toDate() };

    setModalState(newValues);
    showModal();

    console.log("Received values of form:", newValues);
  };
  return (
    <>
      {loading ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Space>
      ) : (
        <Row
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Row>
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                key={"debtor"}
                name="debtor"
                label="Debtor"
                rules={[{ required: true }]}
              >
                <Select>
                  {NAMES.map((name) => (
                    <Option value={name} key={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.List name="creditors">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item key={index + "creditor"}>
                        <Form.Item
                          {...field}
                          name={[field.name, "name"]}
                          label="Creditor"
                          rules={[{ required: true }]}
                        >
                          <Select>
                            {NAMES.map((name) => (
                              <Option value={name} key={name}>
                                {name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...field}
                          key={index + "credit"}
                          name={[field.name, "amount"]}
                          label="Credit"
                          rules={[
                            {
                              required: true,
                              type: "number",
                              min: 0,
                              message:
                                "Please enter a number greater than or equal to 0",
                            },
                          ]}
                        >
                          <InputNumber width={"100%"} />
                        </Form.Item>
                        <Button onClick={() => remove(field.name)}>
                          Delete
                        </Button>
                      </Form.Item>
                    ))}

                    <Form.Item>
                      <Button onClick={() => add()} type="dashed" block>
                        Add Creditor
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
            <Modal
              open={isModalOpen}
              okText="Send"
              onOk={handleOk}
              onCancel={handleCancel}
              cancelText="Delete"
            >
              <p>Кто вернул: {modalState?.debtor}</p>
              <p>Дата: {formatDate(modalState?.date)}</p>
              <p
                style={{
                  flexDirection: "column",
                }}
              >
                <p>Кому вернул:</p>
                {modalState?.creditors.map((e) => (
                  <p key={e.name}>
                    {e.name} : {e.amount.toFixed(2) + " BYN"}
                  </p>
                ))}
              </p>
            </Modal>
          </Row>
        </Row>
      )}
    </>
  );
};

export default ReturnDebtForm;
