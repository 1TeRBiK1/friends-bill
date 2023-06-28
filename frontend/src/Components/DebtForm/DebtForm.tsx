import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { Form, Input, Select, DatePicker, Button, InputNumber } from "antd";
import http from "../../Axios/http";
const { Option } = Select;

interface DebtFormProps {
  setReset: (prev: number) => void;
}

const DebtForm: React.FC<DebtFormProps> = ({ setReset }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const newValues = { ...values, date: values.date.toDate() };
    console.log("Received values of form:", newValues);
    http.post("/debts", newValues);
    form.resetFields();
    setReset(new Date().getMilliseconds());
  };
  return (
    <Row
      style={{
        marginTop: "40px",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Row
        style={{
          marginBottom: "40px",
        }}
      >
        Add new Debt:{" "}
      </Row>
      <Row>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            key={"creditor"}
            name="creditor"
            label="Creditor"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Nikita">Nikita</Option>
              <Option value="Oleg">Oleg</Option>
              <Option value="Maks">Maks</Option>
            </Select>
          </Form.Item>

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
                        <Option value="Nikita">Nikita</Option>
                        <Option value="Oleg">Oleg</Option>
                        <Option value="Maks">Maks</Option>
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
                    <Button onClick={() => remove(field.name)}>Удалить</Button>
                  </Form.Item>
                ))}

                <Form.Item>
                  <Button onClick={() => add()} type="dashed" block>
                    Добавить должника
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="amount"
            label="Total"
            rules={[
              {
                required: true,
                type: "number",
                min: 0,
                message: "Please enter a number greater than or equal to 0",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

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
      </Row>
    </Row>
  );
};

export default DebtForm;
