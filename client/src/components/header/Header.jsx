import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { selectUser } from "@/lib/features/auth/authSlice";
import { useSelector } from "react-redux";
import { ROLES } from "@/constants/constant";
import { useSignOutMutation } from "@/lib/features/auth/authApi";

export default function Header() {
  const { user } = useSelector(selectUser);
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();
  // console.log("header", user, isAuthticated, loading);

  const handleLogout = async () => {
    console.log('logout');

    try {
      await signOut().unwrap();
      navigate('/')
    } catch (err) {
      console.error("Error while logging out: ", err);

    }
  }

  return (
    <div className="bg-zinc-100 sticky top-0 z-50">
      {/* Navbar */}
      <nav className="w-full px-4 lg:px-6 h-16 flex items-center justify-between bg-maroon shadow-lg">

        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500 text-maroon border-2 border-orange-200 font-bold text-lg shadow-md">
            I
          </div>

          <Link to="/admin" className="flex flex-col leading-tight">
            <span className="font-bold text-white text-sm">
              Iravya
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-rose-200">
              Manager
            </span>
          </Link>
        </div>

        {/* Right: User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center">


              <span className="hidden sm:block text-xs font-semibold text-white tracking-wide">
                {user ?
                  `${user.first_name} ${user.last_name} - (${ROLES[user.role].text})`
                  :
                  "Admin Manager"
                }
              </span>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-transparent focus-visible:ring-0"
              >

                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-amber-500 text-maroon font-bold border-2 border-orange-200">
                    {user?.first_name.charAt(0) || "A"}{user?.last_name.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 mt-2"
          >
            {/* Optional user info */}
            {/* 
            <div className="px-3 py-2 text-sm">
              <p className="font-semibold">Admin Manager</p>
              <p className="text-xs text-muted-foreground">
                admin@iravya.com
              </p>
            </div>
            <DropdownMenuSeparator />
            */}

            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-600">
              
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}