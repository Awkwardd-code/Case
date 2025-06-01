"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import StatusDropdown from "./StatusDropdown";
import { fetchOrders } from "./fetchOrders";
import { OrderStatusType } from "@/constants/orderStatus";
import MaxWidthWrapper from "@/components/elements/MaxWidthWrapper";
import { getAdminStatus } from "@/lib/getAdminStatus";

interface Order {
  _id: string;
  user: { email: string };
  shippingAddress?: { name: string };
  status: OrderStatusType;
  createdAt: Date;
  amount: number;
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = not loaded yet
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastWeekSum, setLastWeekSum] = useState<number>(0);
  const [lastMonthSum, setLastMonthSum] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkAdmin = async () => {
      try {
        const status = await getAdminStatus();
        setIsAdmin(status);
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false); // fallback to false
      }
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      const loadOrders = async () => {
        try {
          const data = await fetchOrders();
          setOrders(data.orders);
          setLastWeekSum(data.lastWeekSum);
          setLastMonthSum(data.lastMonthSum);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    }
  }, [isAdmin]);

  // Show loader until session and admin status are both resolved
  if (status === "loading" || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Checking admin access...</p>
      </div>
    );
  }

  // If explicitly not admin, block access
  if (!isAdmin) {
    return notFound();
  }

  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;

  return (
    <MaxWidthWrapper>
      <div className="flex min-h-screen w-full bg-muted/40">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
          <div className="flex flex-col gap-16">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Last Week</CardDescription>
                  <CardTitle className="text-4xl">
                    {formatPrice(lastWeekSum)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)} goal
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={(lastWeekSum * 100) / WEEKLY_GOAL} />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Last Month</CardDescription>
                  <CardTitle className="text-4xl">
                    {formatPrice(lastMonthSum)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    of {formatPrice(MONTHLY_GOAL)} goal
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={(lastMonthSum * 100) / MONTHLY_GOAL} />
                </CardFooter>
              </Card>
            </div>

            <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Purchase date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4}>Loading...</TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No orders found</TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} className="bg-accent">
                      <TableCell>
                        <div className="font-medium">
                          {order.shippingAddress?.name ?? "N/A"}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {order.user.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusDropdown id={order._id} orderStatus={order.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(order.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
