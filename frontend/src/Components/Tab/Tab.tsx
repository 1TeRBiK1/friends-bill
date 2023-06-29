import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import DebtForm from "./Debt/DebtForm/DebtForm";
import ReturnDebtForm from "./Return/ReturnForm/ReturnDebtForm";
import DebtHistory from "./Debt/DebtHistory/DebtHistory";
import ReturnHistory from "./Return/ReturnHistory/ReturnHistory";

const onChange = (key: string) => {
  console.log(key);
};

const items = (
  setReset: (prev: number) => void,
  reset: number
): TabsProps["items"] => [
  {
    key: "1",
    label: `Add new Debt`,
    children: (
      <>
        <DebtForm setReset={setReset} />
        <DebtHistory reset={reset} setReset={setReset} />
      </>
    ),
  },
  {
    key: "2",
    label: `Add new Return-Debt`,
    children: (
      <>
        <ReturnDebtForm setReset={setReset} />
        <ReturnHistory reset={reset} setReset={setReset} />
      </>
    ),
  },
];

const Tab: React.FC<{
  setReset: (prev: number) => void;
  reset: number;
}> = ({ setReset, reset }) => (
  <Tabs
    style={{ marginTop: 40 }}
    centered={true}
    defaultActiveKey="1"
    items={items(setReset, reset)}
    onChange={onChange}
  />
);

export default Tab;
