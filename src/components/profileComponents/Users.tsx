import { SetLoading } from "@/redux/loadersSlice";
import { Table, message } from "antd";
import axios from "axios";
import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";

function Users() {
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/users");
      setUsers(response.data.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const onUserUpdate = async (id: any, isActive: any) => {
    try {
      dispatch(SetLoading(true));
      await axios.put(`/api/users/${id}`, { isActive });
      message.success("User info has been updated successfully");
      getData();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt: any) => moment(createdAt).format("DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt: any) => moment(updatedAt).format("DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: any, record: any) => (
        <select
          value={isActive.toString()}
          onChange={(e) => onUserUpdate(record._id , e.target.value)}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </div>
  );
}

export default Users;
