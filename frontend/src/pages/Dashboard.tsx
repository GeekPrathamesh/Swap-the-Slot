import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import AddEventModal from "@/components/AddEventModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Event } from "@/types";
import { toast } from "sonner";
import API from "@/api/axios";

// ✅ Generate all days in current month
const getMonthDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  // Calendar setup
  const [currentDate] = useState(new Date());
  const daysInMonth = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // ✅ Check token and fetch events
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    fetchEvents();
  }, [navigate]);

  // ✅ Fetch user's events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/event/events");
      setEvents(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or update event
  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      if (eventData._id) {
        const res = await API.put(`/event/events/${eventData._id}`, eventData);
        setEvents((prev) =>
          prev.map((e) => (e._id === res.data._id ? res.data : e))
        );
        toast.success("Event updated successfully");
      } else {
        const res = await API.post("/event/events", eventData);
        setEvents((prev) => [...prev, res.data]);
        toast.success("Event created successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving event");
    } finally {
      setIsAddModalOpen(false);
      setEditingEvent(null);
    }
  };

  // ✅ Delete event
  const handleDeleteEvent = async (id: string) => {
    try {
      await API.delete(`/event/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting event");
    }
  };

  // ✅ Toggle swappable
  const handleToggleSwappable = async (event: Event) => {
    try {
      const newStatus = event.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
      const res = await API.put(`/event/events/${event._id}`, {
        status: newStatus,
      });
      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? res.data : e))
      );
      toast.success(
        newStatus === "SWAPPABLE"
          ? "Slot marked as Swappable 🔁"
          : "Slot marked as Busy"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  // ✅ Filter events by date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage your events and swap availability
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEvent(null);
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Event Cards */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first event
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={() => handleDeleteEvent(event._id)}
                onToggleSwappable={() => handleToggleSwappable(event)}
              />
            ))}
          </div>
        )}

        {/* 📅 Calendar Grid */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Calendar View - Current Month only - ( December )
          </h2>
          <div className="grid grid-cols-7 gap-3 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-muted-foreground">
                {day}
              </div>
            ))}

            {daysInMonth.map((date) => {
              const dayEvents = getEventsForDate(date);
              return (
                <div
                  key={date.toISOString()}
                  className="h-24 rounded-lg border bg-card p-2 shadow-sm"
                >
                  <div className="text-sm font-medium text-foreground">
                    {date.getDate()}
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event) => (
                        <div
                          key={event._id}
                          className={`rounded px-2 py-1 text-white truncate ${
                            event.status === "BUSY"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          title={`${event.title} (${event.status})`}
                        >
                          {event.title || event.status}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-[10px] italic">
                        No Events
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Add/Edit Modal */}
        <AddEventModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSave={handleSaveEvent}
          editEvent={editingEvent}
        />
      </main>
    </div>
  );
};

export default Dashboard;
