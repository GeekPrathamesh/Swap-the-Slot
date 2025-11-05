import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwapRequest } from "@/types";
import { ArrowRight, Check, X, Repeat2 } from "lucide-react";
import { toast } from "sonner";
import API from "@/api/axios";

const Requests = () => {
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch and transform requests
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [incomingRes, outgoingRes] = await Promise.all([
        API.get("/swap/incoming", { headers }),
        API.get("/swap/outgoing", { headers }),
      ]);

      const incomingData = incomingRes.data.map((r: any) => ({
        id: r._id,
        requesterId: r.fromUser?._id,
        requesterName: r.fromUser?.name,
        targetUserId: r.toUser?._id,
        targetUserName: r.toUser?.name,
        offeredSlotId: r.theirSlot?._id, // they’re offering this
        offeredSlot: r.theirSlot,
        requestedSlotId: r.mySlot?._id, // your slot
        requestedSlot: r.mySlot,
        status: r.status,

      }));

      const outgoingData = outgoingRes.data.map((r: any) => ({
        id: r._id,
        requesterId: r.fromUser?._id,
        requesterName: r.fromUser?.name,
        targetUserId: r.toUser?._id,
        targetUserName: r.toUser?.name,
        offeredSlotId: r.mySlot?._id, // you’re offering this
        offeredSlot: r.mySlot,
        requestedSlotId: r.theirSlot?._id, // you’re requesting this
        requestedSlot: r.theirSlot,
        status: r.status,
      }));

      setIncomingRequests(incomingData);
      setOutgoingRequests(outgoingData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch swap requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Handle Accept / Reject
  const handleResponse = async (id: string, accept: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/swap/swap-response/${id}`,
        { accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.msg);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update request");
    }
  };

  // ✅ Status Badge
  const getStatusBadge = (status: SwapRequest["status"]) => {
    const config = {
      PENDING: { label: "Pending", className: "status-pending" },
      ACCEPTED: { label: "Accepted", className: "status-swappable" },
      REJECTED: {
        label: "Rejected",
        className: "bg-destructive text-destructive-foreground",
      },
    };
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading requests...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Repeat2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Swap Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage incoming and outgoing swap requests
            </p>
          </div>
        </div>

        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="incoming">
              Incoming ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing">
              Outgoing ({outgoingRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* ✅ Incoming Requests */}
          <TabsContent value="incoming" className="mt-6">
            {incomingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No incoming requests.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            From: {r.requesterName || "Unknown User"}
                          </h3>

                        </div>
                        {getStatusBadge(r.status)}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 items-center">
                        <div className="p-3 rounded bg-muted/50">
                          <p className="text-xs">They’re offering</p>
                          <h4 className="font-semibold">{r.offeredSlot?.title}</h4>
                        </div>
                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="p-3 rounded bg-primary/10">
                          <p className="text-xs">For your slot</p>
                          <h4 className="font-semibold">{r.requestedSlot?.title}</h4>
                        </div>
                      </div>

                      {r.status === "PENDING" && (
                        <div className="flex gap-3 pt-2">
                          <Button className="flex-1" onClick={() => handleResponse(r.id, true)}>
                            <Check className="mr-2 h-4 w-4" /> Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-destructive"
                            onClick={() => handleResponse(r.id, false)}
                          >
                            <X className="mr-2 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ✅ Outgoing Requests */}
          <TabsContent value="outgoing" className="mt-6">
            {outgoingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No outgoing requests.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {outgoingRequests.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            To: {r.targetUserName || "Unknown User"}
                          </h3>

                        </div>
                        {getStatusBadge(r.status)}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 items-center">
                        <div className="p-3 rounded bg-muted/50">
                          <p className="text-xs">You’re offering</p>
                          <h4 className="font-semibold">{r.offeredSlot?.title}</h4>
                        </div>
                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="p-3 rounded bg-primary/10">
                          <p className="text-xs">Requesting</p>
                          <h4 className="font-semibold">{r.requestedSlot?.title}</h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Requests;
