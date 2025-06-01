"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderStatus, OrderStatusType } from "@/constants/orderStatus"; // ✅ Updated
import { changeOrderStatus } from "./actions";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

const LABEL_MAP: Record<OrderStatusType, string> = {
  [OrderStatus.AWAITING_SHIPMENT]: "Awaiting Shipment",
  [OrderStatus.FULFILLED]: "Fulfilled",
  [OrderStatus.SHIPPED]: "Shipped",
};

const StatusDropdown = ({
  id,
  orderStatus,
}: {
  id: string;
  orderStatus: OrderStatusType;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatusType) => {
    try {
      await changeOrderStatus({ id, newStatus });
      setError(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-52 flex justify-between items-center"
          >
            {LABEL_MAP[orderStatus]}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          {Object.values(OrderStatus).map((status) => (
            <DropdownMenuItem
              key={status}
              className={cn(
                "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
                {
                  "bg-zinc-100": orderStatus === status,
                }
              )}
              onClick={() => handleStatusChange(status)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 text-primary",
                  orderStatus === status ? "opacity-100" : "opacity-0"
                )}
              />
              {LABEL_MAP[status]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default StatusDropdown;
