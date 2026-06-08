import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Tetap tangkap body agar tidak menyebabkan error di frontend
    const body = await request.json();

    // Data statis (bypass) yang meniru struktur asli Biteship
    const mockData = {
      success: true,
      message: "Successfully fetched rates (Bypass)",
      pricing: [
        {
          company: "jne",
          type: "REG",
          courier_service_name: "JNE REG",
          price: 15000,
        },
        {
          company: "sicepat",
          type: "BEST",
          courier_service_name: "Sicepat BEST",
          price: 22000,
        },
        {
          company: "jnt",
          type: "EZ",
          courier_service_name: "J&T EZ",
          price: 16000,
        },
        {
          company: "grab",
          type: "SameDay",
          courier_service_name: "GrabExpress SameDay",
          price: 35000,
        }
      ]
    };

    // Simulasi delay jaringan (loading) selama 1 detik agar terasa nyata
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(mockData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}