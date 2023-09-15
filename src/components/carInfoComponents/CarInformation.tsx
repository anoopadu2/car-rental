"use client";
import { Button, Col, DatePicker, Row, message } from "antd";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SetLoading } from "@/redux/loadersSlice";
import StripeCheckout from "react-stripe-checkout";

const { RangePicker } = DatePicker;

function CarInformation({ car }: any) {
  const [isSlotAvailable, setIsSlotAvailable] = React.useState(false);
  //change null to current time by default
  const [fromSlot, setFromSlot] = React.useState(null);
  const [toSlot, setToSlot] = React.useState(null);
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.users);
  const dispatch = useDispatch();

  const bookNow = async (token: any) => {
    const payload = {
      car: car._id,
      user: currentUser._id,
      fromSlot,
      toSlot,
      totalHours: moment(toSlot).diff(moment(fromSlot), "hours"),
      totalAmount:
        moment(toSlot).diff(moment(fromSlot), "hours") * car?.rentPerHour,
      token,
    };
    try {
      dispatch(SetLoading(true));
      await axios.post("/api/bookings", payload);
      message.success("Booking has been added successfully");
      router.push("/profile");
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.post("/api/checkAvailability", {
        car: car._id,
        fromSlot,
        toSlot,
      });
      if (response.data.success) {
        message.success("Slot Available");
        setIsSlotAvailable(true);
      } else {
        throw new Error("Slot Not Available");
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    setIsSlotAvailable(false);
  }, [fromSlot, toSlot]);

  return (
    <div>
      <Row justify="center">
        <Col span={16} className="card p-5 flex flex-col gap-5">
          <h1 className="text-xl">{car?.name}</h1>
          <img src={car.carImage} alt="" height="500" width="100%" />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>
                <b>Brand:</b>
              </span>
              <span>{car?.brand}</span>
            </div>

            <div className="flex justify-between">
              <span>
                <b>Fuel Type:</b>
              </span>
              <span>{car?.fuelType}</span>
            </div>

            <div className="flex justify-between">
              <span>
                <b>Seating Capacity:</b>
              </span>
              <span>{car?.seatingCapacity}</span>
            </div>

            <div className="flex justify-between">
              <span>
                <b>Rent Per Hour:</b>
              </span>
              <span>{car?.rentPerHour}</span>
            </div>

            <div className="flex justify-center gap-5 items-center">
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={(value: any) => {
                  setFromSlot(value[0]?.toDate());
                  setToSlot(value[1]?.toDate());
                }}
                disabledDate={(current) => {
                  return current && current < moment().endOf("day");
                }}
              />

              <Button
                type="primary"
                disabled={!fromSlot || !toSlot}
                onClick={checkAvailability}
              >
                Check Availability
              </Button>
            </div>

            {fromSlot && toSlot && (
              <>
                <div className="flex justify-between items-center flex-col my-3">
                  <h1 className="text-xl">
                    Total Hours :{" "}
                    {moment(toSlot).diff(moment(fromSlot), "hours")}
                  </h1>

                  <h1 className="text-xl">
                    Total Amount : ${" "}
                    {moment(toSlot).diff(moment(fromSlot), "hours") *
                      car?.rentPerHour}
                  </h1>
                </div>
              </>
            )}

            <div className="flex justify-end gap-5 my-10">
              <Button
                type="default"
                onClick={() => {
                  router.back();
                }}
              >
                Back
              </Button>

              <StripeCheckout
                stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                token={bookNow}
                currency="USD"
                amount={
                  moment(toSlot).diff(moment(fromSlot), "hours") *
                  car?.rentPerHour *
                  100
                }
                shippingAddress
              >
                <Button
                  type="primary"
                  title="Book Now"
                  disabled={!fromSlot || !toSlot || !isSlotAvailable}
                >
                  Book Now
                </Button>
              </StripeCheckout>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CarInformation;