import Link from "next/link";
import ProtectedLinks from "./protectedLinks";
import LogoutButton from "../logoutButton";
import { getUserFromCookies } from "@/lib/auth";

const Navbar = async () => {
  
  const user = await getUserFromCookies();

  const isLoggedIn = !!user;

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center cursor-pointer">
              <Link href="/">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === "manager" && (
                  <Link
                    href="/manager"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Manager Dashboard
                  </Link>
                )}
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Home
                </Link>

                <ProtectedLinks user={user} />
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/signup"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Signup
                </Link>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
