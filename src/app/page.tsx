"use client"
import { LoginButton, LogoutButton, RegisterButton } from "@/components/auth/authButtons";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return (
      <Spinner background="white" />
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {session ? (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome, {session.user?.name || "User"}!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              You can now book your train seats or manage your bookings.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant={"info"}
                onClick={() => router.push("/booking")} // Update with the correct booking page URL
              >
                Book tickets
              </Button>
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Train Seat Booking
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please log in or register to book your seats.
            </p>

            <div className="flex justify-center gap-4">
              <LoginButton />
              <RegisterButton />
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Workwise Train Booking Problem. All rights reserved.
      </footer>
    </main>
  );
}
