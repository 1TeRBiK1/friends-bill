import { useState } from "react";
import { Row, Switch, Modal, Space, Spin } from "antd";
import { Form, Input, Select, DatePicker, Button, InputNumber } from "antd";
import http from "../../../../Axios/http";
import { IDeptor } from "../../../../Types/Deptor";
import { IDebtHistory } from "../../../../Types/DebtHistory";
import { formatDate } from "../DebtHistory/DebtHistory";
const { Option } = Select;

const NAMES = ["Nikita", "Oleg", "Maks"];

interface DebtFormProps {
  setReset: (prev: number) => void;
}

const DebtForm: React.FC<DebtFormProps> = ({ setReset }) => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState<IDebtHistory>({
    _id: 0,
    creditor: "creditor",
    debtors: [],
    amount: 0,
    date: new Date(),
    description: "description",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    http.post("/debts", modalState).then(() => {
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

  const [onThree, setOnThree] = useState(false);
  const [onFour, setOnFour] = useState(false);

  const onFinish = (values: any) => {
    const newValues = { ...values, date: values.date.toDate() };
    if (onThree) {
      newValues.debtors = [...NAMES]
        .filter((e) => e !== newValues.creditor)
        .map((name) => ({ name, amount: newValues.amount / 3 }));
    } else if (onFour) {
      newValues.debtors = [...NAMES]
        .filter((e) => e !== newValues.creditor)
        .map((name) => ({
          name,
          amount:
            name === NAMES[0]
              ? (2 * newValues.amount) / 4
              : newValues.amount / 4,
        }));
    } else {
      newValues.amount = newValues.debtors.reduce(
        (acc: number, debtor: IDeptor) => (acc += debtor.amount),
        0
      );
    }

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
                key={"creditor"}
                name="creditor"
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
              <Form.Item>
                <div>
                  For three{" "}
                  <Switch
                    checked={onThree}
                    onChange={(checked) => {
                      setOnThree(checked);
                      setOnFour(false);
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item>
                <div>
                  For four{" "}
                  <Switch
                    checked={onFour}
                    onChange={(checked) => {
                      setOnThree(false);
                      setOnFour(checked);
                    }}
                  />
                </div>
              </Form.Item>
              {!onFour && !onThree ? (
                <Form.List name="debtors">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item key={index + "Debtor"}>
                          <Form.Item
                            {...field}
                            name={[field.name, "name"]}
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
                          <Form.Item
                            {...field}
                            key={index + "Debt"}
                            name={[field.name, "amount"]}
                            label="Debt"
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
                            Удалить
                          </Button>
                        </Form.Item>
                      ))}

                      <Form.Item>
                        <Button onClick={() => add()} type="dashed" block>
                          Add Debtor
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              ) : null}

              {onFour || onThree ? (
                <Form.Item
                  name="amount"
                  label="Total"
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
                  <InputNumber />
                </Form.Item>
              ) : null}

              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
            <Modal
              title={modalState?.description}
              open={isModalOpen}
              okText="Send"
              onOk={handleOk}
              onCancel={handleCancel}
              cancelText="Delete"
            >
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
      )}
    </>
  );
};

export default DebtForm;
