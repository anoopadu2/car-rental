import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Table, message } from "antd";
import { SetLoading } from "@/redux/loadersSlice";
import moment from "moment";

interface RootState {
    users: {
      currentUser: {
        isAdmin: boolean;
        _id: string;
      };
    };
  }
  
  // Define a type for the Booking
interface Booking {
    _id: string;
    user: { name: string };
    car: { name: string };
    totalHours: number;
    totalAmount: number;
    status: string;
    fromSlot: Date;
    toSlot: Date;
  }

interface AxiosError {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  }
  

function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.users);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModel, setShowCancelModel] = useState(false);

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let url = "/api/bookings";
      if (!currentUser.isAdmin) {
        url = `/api/bookings?user=${currentUser._id}`;
      }
      const response = await axios.get(url);
      setBookings(response.data.data);
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const onCancel = async () => {

    if (!selectedBooking) return; // Ensure selectedBooking is not null
    try {
      dispatch(SetLoading(true));
      await axios.put(`/api/bookings/${selectedBooking._id}`, {
        status: "cancelled",
      });
      message.success("Booking has been cancelled successfully");
      setShowCancelModel(false);
      getData();
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Booking Id",
      dataIndex: "_id",
    },
    {
      title: "User",
      dataIndex: "user",
      render: (user: { name: string }) => user.name,
    },
    {
      title: "Car",
      dataIndex: "car",
      render: (car: { name: string }) => car.name,
    },
    {
      title: "Total Hours",
      dataIndex: "totalHours",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => status.toUpperCase(),
    },
    {
      title: "From Slot",
      dataIndex: "fromSlot",
      render: (fromSlot: Date) => moment(fromSlot).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "To Slot",
      dataIndex: "toSlot",
      render: (toSlot: Date) => moment(toSlot).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      render: (record: any) => (
        <div>
          {record.status === "approved" && (
            <span
              className="underline"
              onClick={() => {
                setSelectedBooking(record);
                setShowCancelModel(true);
              }}
            >
              Cancel
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={bookings} columns={columns} />;
      {showCancelModel && selectedBooking && (
        <Modal
          open={showCancelModel}
          onCancel={() => setShowCancelModel(false)}
          title="Cancel Booking"
          okText="Cancel Booking"
          cancelText="Close"
          onOk={onCancel}
        >
          <div className="flex flex-col gap-5">
            <span>
              Are you sure you want to cancel the booking with id ?
              {selectedBooking._id}
            </span>

            <span>
              <b>Note</b> : Refund Not Available.
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BookingsTable;
