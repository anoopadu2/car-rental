import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import CarInformation from "@/components/carInfoComponents/CarInformation";

export async function getCar(carid: any) {
  try {
    const cookeStore: any = cookies();
    const token = cookeStore.get("token").value;
    const response = await axios.get(
      `${process.env.DOMAIN}/api/cars/${carid}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export default async function CarInfo({ params }: any) {
  const car = await getCar(params?.carid);
  return (
    car && (
      <div className="p-5">
        <CarInformation car={car} />
      </div>
    )
  );
}