"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Send, HelpCircle, ArrowLeft, Languages, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: { full_name: string; email: string };
  support_messages: Array<{
    id: string;
    message: string;
    is_admin: boolean;
    created_at: string;
    sender_id: string;
    profiles?: { full_name: string; email: string };
  }>;
}

const faqData = [
  {
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page to receive an email with reset instructions.",
  },
  {
    question: "How do I change my learning language?",
    answer: "Go to profile settings and select a new target language. Progress is saved per language.",
  },
  {
    question: "Can I use the app offline?",
    answer: "Yes, install LingslatePal as a PWA for offline lesson access. Translation requires internet.",
  },
  {
    question: "How is my progress calculated?",
    answer: "Progress tracks completed lessons, quiz scores, daily streaks, and XP points.",
  },
  {
    question: "Is LingslatePal really free?",
    answer: "Yes, all features are free using open-source translation services. No hidden fees.",
  },
  {
    question: "How accurate are the translations?",
    answer: "LibreTranslate is generally accurate, but verify important translations with native speakers.",
  },
  {
    question: "Can I request new languages?",
    answer: "Use the 'Request New Language' button on the homepage to suggest languages.",
  },
  {
    question: "How do streaks work?",
    answer: "Complete a lesson, quiz, or translation daily to maintain streaks. Missing a day resets it.",
  },
];

export default function SupportPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: ticketsData, error } = await supabase
          .from("support_tickets")
          .select(`
            *,
            profiles:user_id (full_name, email),
            support_messages (
              id,
              message,
              is_admin,
              created_at,
              profiles:sender_id (full_name, email)
            )
          `)
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTickets(ticketsData || []);
      }
    } catch (error) {
      console.error("Error loading support data:", error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to create a support ticket");
      return;
    }

    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);

    try {
      const { data: ticket, error: ticketError } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject: newTicketSubject.trim(),
          status: "open",
          priority: "medium",
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: messageError } = await supabase.from("support_messages").insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message: newTicketMessage.trim(),
        is_admin: false,
      });

      if (messageError) throw messageError;

      toast.success("Support ticket created successfully!");
      setNewTicketSubject("");
      setNewTicketMessage("");
      await loadSupportData();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create support ticket");
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTicket || !newMessage.trim()) {
      toast.error("Please select a ticket and enter a message");
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase.from("support_messages").insert({
        ticket_id: selectedTicket.id,
        sender_id: user.id,
        message: newMessage.trim(),
        is_admin: false,
      });

      if (error) throw error;

      await supabase.from("support_tickets").update({ status: "open", updated_at: new Date().toISOString() }).eq("id", selectedTicket.id);

      toast.success("Message sent!");
      setNewMessage("");
      await loadSupportData();

      const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading support...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">LingslatePal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Help & Support</h1>
          <p className="text-slate-600">Get help with LingslatePal or contact our support team</p>
        </motion.div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 border border-slate-200">
            <TabsTrigger value="faq" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 text-slate-700">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 text-slate-700">
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 text-slate-700">
              Contact Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Find quick answers to common questions about LingslatePal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-slate-800 font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-slate-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            {!user ? (
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Login Required</h3>
                  <p className="text-slate-600 mb-4">Please log in to view your support tickets</p>
                  <Link href="/auth/login">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Login to Continue
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Your Support Tickets</CardTitle>
                    <CardDescription className="text-slate-600">View and manage your support requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedTicket?.id === ticket.id
                                ? "border-blue-300 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getStatusColor(ticket.status)}>
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1">{ticket.status.replace("_", " ")}</span>
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-medium text-slate-800 text-sm mb-1">{ticket.subject}</h4>
                            <p className="text-xs text-slate-600">
                              {ticket.support_messages.length} message{ticket.support_messages.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        ))}
                        {tickets.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No support tickets yet</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {selectedTicket && (
                  <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-800">{selectedTicket.subject}</CardTitle>
                      <CardDescription className="text-slate-600">
                        Ticket #{selectedTicket.id.slice(0, 8)} • {selectedTicket.status.replace("_", " ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64 mb-4">
                        <div className="space-y-3">
                          {selectedTicket.support_messages
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map((message) => (
                              <div
                                key={message.id}
                                className={`p-3 rounded-lg ${
                                  message.is_admin ? "bg-blue-100 ml-4" : "bg-slate-100 mr-4"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-slate-800">
                                    {message.is_admin ? "Support Team" : message.profiles?.full_name || "You"}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(message.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700">{message.message}</p>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>

                      {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" && (
                        <form onSubmit={sendMessage} className="space-y-3">
                          <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={3}
                            className="border-slate-200 bg-white/80 text-slate-800"
                          />
                          <Button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            {sending ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact">
            {!user ? (
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Login Required</h3>
                  <p className="text-slate-600 mb-4">Please log in to contact support</p>
                  <Link href="/auth/login">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Login to Continue
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-slate-800">Contact Support</CardTitle>
                  <CardDescription className="text-slate-600">
                    Create a new support ticket and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createTicket} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Subject</label>
                      <Input
                        placeholder="Brief description of your issue"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        required
                        className="border-slate-200 bg-white/80 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Message</label>
                      <Textarea
                        placeholder="Please describe your issue in detail..."
                        value={newTicketMessage}
                        onChange={(e) => setNewTicketMessage(e.target.value)}
                        rows={6}
                        required
                        className="border-slate-200 bg-white/80 text-slate-800"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {sending ? (
                        "Creating Ticket..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Create Support Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
