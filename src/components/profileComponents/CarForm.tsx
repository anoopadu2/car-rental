import { antdFieldValidation } from "@/helpers/validationHelpers";
import { SetLoading } from "@/redux/loadersSlice";
import { Col, Form, Modal, Row, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";

interface CarFormProps {
    showCarFormModal: boolean;
    setShowCarFormModal: (value: boolean) => void;
    reloadData: () => void;
    selectedCar?: {
      _id: string;
      [key: string]: any; // This is a generic type for a car object. You might want to replace it with a more specific type if available.
    }| null;
  }
  
  interface CarFormData {
    name: string;
    brand: string;
    fuelType: string;
    rentPerHour: number;
    seatingCapacity: number;
    carImage: string;
    _id?: string;
  }
  
  interface AxiosError {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  }
  


function CarForm({
  showCarFormModal,
  setShowCarFormModal,
  reloadData,
  selectedCar,
}: CarFormProps) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: CarFormData) => {
    try {
      dispatch(SetLoading(true));
      let response = null;

      if (selectedCar) {
        values._id = selectedCar._id;
        response = await axios.put(`/api/cars/${selectedCar._id}`, values);
      } else {
        response = await axios.post("/api/cars", values);
      }
      reloadData();
      message.success(response.data.message);
      setShowCarFormModal(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      width={800}
      open={showCarFormModal}
      onCancel={() => setShowCarFormModal(false)}
      centered
      okText="Save"
      onOk={() => {
        form.submit();
      }}
    >
      <h1 className="text-center text-xl mb-3 uppercase">
        {selectedCar ? "Edit Car" : "Add Car"}
      </h1>

      <Form
        layout="vertical"
        className="flex flex-col gap-5 mb-3"
        onFinish={onFinish}
        form={form}
        initialValues={selectedCar || {
          name: "",
          brand: "",
          fuelType: "",
          rentPerHour: 0,
          seatingCapacity: 0,
          carImage: "",
          }
        }
      >
        <Form.Item label="Car Name" name="name" rules={antdFieldValidation}>
          <input type="text" />
        </Form.Item>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Brand" name="brand" rules={antdFieldValidation}>
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Fuel Type"
              name="fuelType"
              rules={antdFieldValidation}
            >
              <select>
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Rent Per Hour"
              name="rentPerHour"
              rules={antdFieldValidation}
            >
              <input type="number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Seating Capacity"
              name="seatingCapacity"
              rules={antdFieldValidation}
            >
              <input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Car Image"
          name="carImage"
          rules={antdFieldValidation}
        >
          <input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CarForm;
