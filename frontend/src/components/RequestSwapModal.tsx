import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface RequestSwapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestedSlot: Event | null;
  mySwappableSlots: Event[];
  onConfirm: (offeredSlot: Event) => void;
}

const RequestSwapModal = ({
  open,
  onOpenChange,
  requestedSlot,
  mySwappableSlots,
  onConfirm,
}: RequestSwapModalProps) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  if (!requestedSlot) return null;

  const handleSelect = (slot: Event) => {
    setSelectedSlotId(slot._id);
    onConfirm(slot); // directly trigger the backend swap request
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Offer a Slot for Swap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              You’re requesting:{" "}
              <span className="font-semibold text-foreground">
                {requestedSlot.title}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Select one of your swappable slots to offer in exchange:
            </p>
          </div>

          {mySwappableSlots.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                You don’t have any swappable slots available.
                <br />
                <span className="text-sm">
                  Mark some of your events as “Swappable” in your Dashboard first.
                </span>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {mySwappableSlots.map((slot) => (
                <Card
                  key={slot._id}
                  className={`cursor-pointer transition-all ${
                    selectedSlotId === slot._id
                      ? "border-primary shadow-md"
                      : "hover:shadow-md hover:border-primary"
                  }`}
                  onClick={() => handleSelect(slot)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {slot.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(slot.startTime),
                            "MMM dd, yyyy • h:mm a"
                          )}{" "}
                          -{" "}
                          {format(new Date(slot.endTime), "h:mm a")}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSlotId(null);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestSwapModal;
