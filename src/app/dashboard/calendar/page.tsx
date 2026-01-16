"use client";
import { useState, useEffect } from "react";
import { InteractiveCalendar } from "@/components/calendar/interactive-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Phone,
  AlertCircle,
  Search,
  Filter,
  Plus,
  User,
  FileText,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { format, isSameDay, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLeads } from "@/app/context/LeadContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/lib/api";

type CalendarEvent = {
  id: string;
  title: string;
  leadName: string;
  leadPhone: string;
  problem: string;
  time: string;
  date: Date;
  status: string;
  description: string;
};

type NewLeadFormData = {
  name: string;
  phone: string;
  problem: string;
  date: string;
  time: string;
  status: string;
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [activeTab, setActiveTab] = useState("calendar");
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState<NewLeadFormData>({
    name: "",
    phone: "",
    problem: "",
    date: format(new Date(), "dd/MM/yyyy"),
    time: "10:00",
    status: "Pending",
  });
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  const { toast } = useToast();
  const { leads, loading, refetchLeads } = useLeads();

  // Transform leads into calendar events
  useEffect(() => {
    if (!loading && leads.length > 0) {
      const calendarEvents = leads.map((lead) => {
        let eventDate = new Date();
        try {
          if (lead.date.includes("/")) {
            const [day, month, year] = lead.date.split("/");
            eventDate = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );
          } else {
            eventDate = new Date(lead.date);
          }
        } catch (error) {
          eventDate = new Date(lead.created_at);
        }

        const leadTime = lead.time || "10:00";
        // Ensure time is in HH:MM format
        let formattedTime = "10:00 AM";
        try {
          // If time is just a number like "10", convert to "10:00"
          const timeStr = leadTime.includes(":") ? leadTime : `${leadTime}:00`;
          // Pad hours to 2 digits
          const [hours, minutes] = timeStr.split(":");
          const paddedHours = hours.padStart(2, "0");
          const paddedMinutes = (minutes || "00").padStart(2, "0");
          const timeForFormat = `1970-01-01T${paddedHours}:${paddedMinutes}`;
          formattedTime = format(new Date(timeForFormat), "hh:mm a");
        } catch (error) {
          console.error("Error formatting time:", leadTime, error);
          formattedTime = "10:00 AM";
        }

        return {
          id: `lead-${lead.id}`,
          title:
            lead.problem.length > 30
              ? `${lead.problem.substring(0, 30)}...`
              : lead.problem,
          leadName: lead.name,
          leadPhone: lead.phone,
          problem: lead.problem,
          time: formattedTime,
          date: eventDate,
          status: lead.status,
          description: `Problem: ${lead.problem} | Status: ${lead.status} | Phone: ${lead.phone}`,
        };
      });

      setEvents(calendarEvents);
    }
  }, [leads, loading]);

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      event.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.leadPhone.includes(searchTerm) ||
      event.problem.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      event.status.toLowerCase() === statusFilter.toLowerCase();

    // Date range filter
    const matchesDateRange =
      !dateRange.from ||
      !dateRange.to ||
      (event.date >= dateRange.from && event.date <= dateRange.to);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormDate(date);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setFormDate(today);
    setCalendarKey(Date.now());
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({});
  };

  const handleCreateNewLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingLead(true);

    try {
      const token = localStorage.getItem("Auth");
      const response = await fetch(API.bookings, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLeadForm),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "New lead created successfully.",
        });

        // Reset form
        setNewLeadForm({
          name: "",
          phone: "",
          problem: "",
          date: format(new Date(), "dd/MM/yyyy"),
          time: "10:00",
          status: "Pending",
        });
        setShowNewLeadForm(false);

        // Refresh leads
        await refetchLeads();
      } else {
        throw new Error("Failed to create lead");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new lead. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating lead:", error);
    } finally {
      setIsCreatingLead(false);
    }
  };

  const eventsForSelectedDay = filteredEvents.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  // Status counts for filter
  const statusCounts = {
    all: events.length,
    pending: events.filter((e) => e.status.toLowerCase() === "pending").length,
    scheduled: events.filter((e) => e.status.toLowerCase() === "scheduled")
      .length,
    completed: events.filter((e) => e.status.toLowerCase() === "completed")
      .length,
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Calendar & Leads
          </h1>
          <p className="text-muted-foreground">
            Manage appointments and leads in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <User className="h-3 w-3" />
              Total: {leads.length}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
            >
              <AlertCircle className="h-3 w-3" />
              Pending: {statusCounts.pending}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={refetchLeads}
            disabled={loading}
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={handleGoToToday} size="sm">
            Today
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="leads" className="gap-2">
            <User className="h-4 w-4" />
            All Leads ({leads.length})
          </TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          {/* Search and Filters Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Status ({statusCounts.all})
                    </SelectItem>
                    <SelectItem value="pending">
                      Pending ({statusCounts.pending})
                    </SelectItem>
                    <SelectItem value="scheduled">
                      Scheduled ({statusCounts.scheduled})
                    </SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd")} -{" "}
                            {format(dateRange.to, "LLL dd")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Date Range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {/* Clear Filters Button */}
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="text-muted-foreground"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading leads...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <InteractiveCalendar
                  key={calendarKey}
                  onDateSelect={handleDateSelect}
                  onGoToToday={handleGoToToday}
                  events={filteredEvents}
                  selectedDate={selectedDate}
                />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Day's Appointments */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {format(selectedDate, "MMMM do, yyyy")}
                      </h3>
                      <Badge variant="secondary">
                        {eventsForSelectedDay.length} appointment
                        {eventsForSelectedDay.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>

                    {eventsForSelectedDay.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {eventsForSelectedDay.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 rounded-lg border bg-card"
                          >
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback
                                  className={cn(
                                    "font-semibold",
                                    getStatusColor(event.status).includes(
                                      "text-"
                                    )
                                      ? getStatusColor(event.status).match(
                                          /text-(\w+)-500/
                                        )?.[1] + "-500"
                                      : ""
                                  )}
                                >
                                  {event.leadName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold">
                                      {event.leadName}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Phone className="h-3 w-3" />
                                      <span>{event.leadPhone}</span>
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={cn(getStatusColor(event.status))}
                                  >
                                    {event.status}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {event.problem}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">
                          No appointments scheduled for this day.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Create New Lead Form */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Create New Lead</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewLeadForm(!showNewLeadForm)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {showNewLeadForm ? "Cancel" : "New Lead"}
                      </Button>
                    </div>

                    {showNewLeadForm ? (
                      <form
                        onSubmit={handleCreateNewLead}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="lead-name">Full Name *</Label>
                          <Input
                            id="lead-name"
                            placeholder="Enter full name"
                            value={newLeadForm.name}
                            onChange={(e) =>
                              setNewLeadForm({
                                ...newLeadForm,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lead-phone">Phone Number *</Label>
                          <Input
                            id="lead-phone"
                            placeholder="Enter phone number"
                            value={newLeadForm.phone}
                            onChange={(e) =>
                              setNewLeadForm({
                                ...newLeadForm,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lead-problem">Problem/Issue *</Label>
                          <Textarea
                            id="lead-problem"
                            placeholder="Describe the problem or reason for appointment"
                            value={newLeadForm.problem}
                            onChange={(e) =>
                              setNewLeadForm({
                                ...newLeadForm,
                                problem: e.target.value,
                              })
                            }
                            required
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="lead-date">Appointment Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newLeadForm.date}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    new Date(
                                      newLeadForm.date
                                        .split("/")
                                        .reverse()
                                        .join("-")
                                    )
                                  }
                                  onSelect={(date) =>
                                    date &&
                                    setNewLeadForm({
                                      ...newLeadForm,
                                      date: format(date, "dd/MM/yyyy"),
                                    })
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lead-time">Time</Label>
                            <Input
                              id="lead-time"
                              type="time"
                              value={newLeadForm.time}
                              onChange={(e) =>
                                setNewLeadForm({
                                  ...newLeadForm,
                                  time: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lead-status">Status</Label>
                          <Select
                            value={newLeadForm.status}
                            onValueChange={(value) =>
                              setNewLeadForm({ ...newLeadForm, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Scheduled">
                                Scheduled
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="Cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isCreatingLead}
                        >
                          {isCreatingLead ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Lead
                            </>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-3">
                          Quickly add new leads to your system
                        </p>
                        <Button onClick={() => setShowNewLeadForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Lead
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* All Leads Tab */}
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  All Leads ({leads.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewLeadForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Lead
                  </Button>
                </div>
              </div>

              {leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Phone</th>
                        <th className="text-left py-3 px-4">Problem</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Time</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {lead.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{lead.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{lead.phone}</td>
                          <td className="py-3 px-4 max-w-xs truncate">
                            {lead.problem}
                          </td>
                          <td className="py-3 px-4">{lead.date}</td>
                          <td className="py-3 px-4">{lead.time}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={cn(getStatusColor(lead.status))}
                            >
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {format(new Date(lead.created_at), "dd/MM/yyyy")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No leads found. Create your first lead!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
