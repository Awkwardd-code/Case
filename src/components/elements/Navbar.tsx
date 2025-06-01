"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { getAdminStatus } from "@/lib/getAdminStatus";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchAdminStatus = async () => {
        try {
          const adminStatus = await getAdminStatus();
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Failed to fetch admin status:", error);
        }
      };
      fetchAdminStatus();
    }
  }, [user]);

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  onClick={() => signOut()}
                  variant={"ghost"}
                >
                  Sign out
                </Button>
                {isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                ) : null}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
               
                <Link
                  href="/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>
                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;