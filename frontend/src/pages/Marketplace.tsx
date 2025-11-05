import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import RequestSwapModal from "@/components/RequestSwapModal";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { toast } from "sonner";
import { Store } from "lucide-react";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Event[]>([]);
  const [mySwappableSlots, setMySwappableSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // ✅ Fetch available swappable slots (from others)
  useEffect(() => {
    const fetchSwappableSlots = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first!");
          navigate("/login");
          return;
        }

        const res = await API.get("/swap/swappable-slots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSlots(res.data);
      } catch (err: any) {
        toast.error(
          err.response?.data?.error || "Failed to fetch swappable slots"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSwappableSlots();
  }, [navigate]);

  // ✅ Fetch your own SWAPPABLE events (only when modal opens)
  const fetchMySwappableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/event/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const swappable = res.data.filter(
        (e: Event) => e.status === "SWAPPABLE"
      );
      setMySwappableSlots(swappable);
    } catch (err: any) {
      toast.error("Failed to fetch your swappable events");
    }
  };

  const handleRequestSwap = async (slot: Event) => {
    setSelectedSlot(slot);
    await fetchMySwappableSlots(); // ✅ fetch user’s own swappable slots before showing modal
    setIsRequestModalOpen(true);
  };

  const handleConfirmSwap = async (offeredSlot: Event) => {
    try {
      const token = localStorage.getItem("token");
      const body = {
        mySlotId: offeredSlot._id,
        theirSlotId: selectedSlot?._id,
      };

      await API.post("/swap/swap-request", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Swap request sent! ✉️");
      setIsRequestModalOpen(false);
      setSelectedSlot(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send swap request");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-swappable">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Available Swappable Slots
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and request swaps from other users
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-20">
            Loading available slots...
          </p>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Store className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No slots available</h3>
            <p className="text-muted-foreground">
              Check back later for new swappable slots.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <div key={slot._id} className="space-y-3">
                <EventCard event={slot} showOwner />
                <Button
                  className="w-full"
                  onClick={() => handleRequestSwap(slot)}
                >
                  Request Swap
                </Button>
              </div>
            ))}
          </div>
        )}

        <RequestSwapModal
          open={isRequestModalOpen}
          onOpenChange={setIsRequestModalOpen}
          requestedSlot={selectedSlot}
          mySwappableSlots={mySwappableSlots}
          onConfirm={handleConfirmSwap}
        />
      </main>
    </div>
  );
};

export default Marketplace;
