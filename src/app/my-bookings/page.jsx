import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/my-bookings/${userId}`,
    {
      cache: "no-store",
    },
  );

  const bookings = await res.json();

  return (
    <section className="container mx-auto py-16">
      <div className="space-y-5">
        {bookings.map((booking) => (
          <div key={booking._id} className="border rounded-xl p-5 bg-white">
            <div className="flex gap-5">
              <img
                src={booking.room.image}
                alt={booking.room.name}
                className="w-52 rounded-xl"
              />

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{booking.room.name}</h2>

                <p>Date: {booking.date}</p>

                <p>
                  Time: {booking.startTime} - {booking.endTime}
                </p>

                <p>Total Cost: ${booking.totalCost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyBookingsPage;
