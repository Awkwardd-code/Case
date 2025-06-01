"use client";

import { useEffect, useState } from "react";
import { getAuthStatus } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [configId, setConfigId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get configurationId from localStorage
    const configurationId = localStorage.getItem("configurationId");
    if (configurationId) {
      setConfigId(configurationId);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        const data = await getAuthStatus();
        if (isMounted && data?.success) {
          if (configId) {
            localStorage.removeItem("configurationId");
            router.push(`/configure/preview?id=${configId}`);
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        // Optionally redirect to an error page or retry
        if (isMounted) {
          setTimeout(checkAuthStatus, 500); // Retry after 500ms
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, [configId, router]);

  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Logging you in...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  // Optional: Render nothing or an error state if not loading
  return null;
};

export default Page;