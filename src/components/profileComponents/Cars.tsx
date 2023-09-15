import { Button, Table, message } from "antd";
import React from "react";
import CarForm from "./CarForm";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";
import axios from "axios";

interface Car {
    _id: string;
    name: string;
    brand: string;
    fuelType: string;
    rentPerHour: number;
    seatingCapacity: number;
    carImage: string;
  }
  
  interface AxiosError {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  }
  
  function Cars() {
    const [cars, setCars] = React.useState<Car[]>([]);
    const [showCarFormModal, setShowCarFormModal] = React.useState(false);
    const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
    const dispatch = useDispatch();
  
    const getData = async () => {
      try {
        dispatch(SetLoading(true));
        const response = await axios.get("/api/cars");
        setCars(response.data.data);
      } catch (error: any) {
        const axiosError: AxiosError = error;
        message.error(axiosError?.response?.data?.message || axiosError.message);
      } finally {
        dispatch(SetLoading(false));
      }
    };
  
    const deleteCar = async (carid: string) => {
      try {
        dispatch(SetLoading(true));
        const response = await axios.delete(`/api/cars/${carid}`);
        message.success(response.data.message);
        getData();
      } catch (error: any) {
        const axiosError: AxiosError = error;
        message.error(axiosError?.response?.data?.message || axiosError.message);
      } finally {
        dispatch(SetLoading(false));
      }
    };
  
    React.useEffect(() => {
      getData();
    }, []);

  const columns = [
    {
      title: "Car Image",
      dataIndex: "carImage",
      render: (carImage: string) => (
        <img src={carImage} alt="car" width="50" height="50" />
      ),
    },
    {
      title: "Car Name",
      dataIndex: "name",
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Fuel Type",
      dataIndex: "fuelType",
    },
    {
      title: "Rent Per Hour",
      dataIndex: "rentPerHour",
    },
    {
      title: "Seating Capacity",
      dataIndex: "seatingCapacity",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Car) => (
        <div className="flex gap-5">
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedCar(record);
              setShowCarFormModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteCar(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            setSelectedCar(null);
            setShowCarFormModal(true);
          }}
        >
          Add Car
        </Button>
      </div>

      <Table dataSource={cars} columns={columns} rowKey="_id" />

      {showCarFormModal && (
        <CarForm
          setShowCarFormModal={setShowCarFormModal}
          showCarFormModal={showCarFormModal}
          selectedCar={selectedCar}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default Cars;