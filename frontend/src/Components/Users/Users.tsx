import { useEffect, useState } from "react";
import http from "../../Axios/http";
import { IUser } from "../../Types/User";
import { Avatar, Row, Col, Spin, Space } from "antd";

const ColorList = ["#f56a00", "#7265e6", "#ffbf00"];

interface UsersProps {}

const Users: React.FC<UsersProps> = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    http
      .get<IUser[]>("/users")
      .then((res) => setUsers(res.data))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Space>
      ) : null}
      <Row justify={"space-around"} style={{ width: "100%" }}>
        {users.map((e, index) => (
          <Col span={8} key={index + "users"}>
            <Row
              justify={"space-around"}
              style={{
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                style={{
                  backgroundColor: ColorList[index],
                  verticalAlign: "middle",
                }}
                size={{ xs: 80, sm: 80, md: 80, lg: 80, xl: 80, xxl: 100 }}
                gap={1}
              >
                <div>{e.name}</div>
              </Avatar>
              <Row
                justify={"space-around"}
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                {e.creditors.map((e, index) => (
                  <Col
                    key={index + "creditors"}
                    span={24}
                    style={{ marginTop: "10px" }}
                  >
                    <div>{e.name}:</div>
                    <div>{e.amount.toFixed(2) + " BYN"}</div>
                  </Col>
                ))}
              </Row>
            </Row>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Users;
