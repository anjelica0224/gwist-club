"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "@/components/footer";
import { Calendar, MapPin, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import eventsData from "@/data/events.json";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: "workshop" | "talk" | "flagship" | "networking";
  attendees?: number;
  highlight?: boolean;
}

const categoryStyles = {
  workshop: {
    badge: "bg-gradient-to-r from-[#0d6d6e] to-[#0a5556]",
    gradient: "from-[#0d6d6e] via-[#0a5556] to-[#064445]",
    accent: "#0d6d6e",
  },
  talk: {
    badge: "bg-gradient-to-r from-[#D6C3A9] to-[#C6B299]",
    gradient: "from-[#D6C3A9] via-[#C6B299] to-[#B6A289]",
    accent: "#D6C3A9",
  },
  flagship: {
    badge: "bg-gradient-to-r from-[#2E3538] to-[#1E2528]",
    gradient: "from-[#2E3538] via-[#1E2528] to-[#0E1518]",
    accent: "#2E3538",
  },
  networking: {
    badge: "bg-gradient-to-r from-[#e8dcc8] to-[#d8ccb8]",
    gradient: "from-[#e8dcc8] via-[#d8ccb8] to-[#c8bca8]",
    accent: "#e8dcc8",
  },
};

export default function EventsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  const events: Event[] = eventsData.events;

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.category === filter);

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      {/* Hero Section - More Dynamic */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0d6d6e] opacity-[0.07] rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#2E3538] opacity-[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D6C3A9] opacity-[0.04] rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-[#0d6d6e]/20">
              <Sparkles className="w-4 h-4 text-[#0d6d6e]" />
              <span className="text-sm font-medium text-gray-700">
                Upcoming Events & Workshops
              </span>
            </div>
            
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-[#2E3538] mb-6 leading-tight">
              Let's Learn,
              <br />
              <span className="italic text-[#0d6d6e]">Grow & Connect</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl">
              Workshops, talks, and experiences designed to empower the next
              generation of women leaders in tech.
            </p>

            {/* Filter Pills - More Stylish */}
            <div className="flex flex-wrap gap-3">
              {[
                { key: "all", label: "All", icon: "✨" },
                { key: "workshop", label: "Workshops", icon: "🛠️" },
                { key: "talk", label: "Talks", icon: "💬" },
                { key: "flagship", label: "Flagship", icon: "🎯" },
                { key: "networking", label: "Network", icon: "🤝" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`group px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    filter === key
                      ? "bg-[#0d6d6e] text-white shadow-xl shadow-[#0d6d6e]/20 scale-105"
                      : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50"
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid - More Creative Layout */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl text-gray-500 font-light">
                No events match this filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {filteredEvents.map((event, index) => {
                const isLarge = event.highlight || index % 7 === 0;
                const style = categoryStyles[event.category];
                
                return (
                  <div
                    key={event.id}
                    className={`${
                      isLarge ? "lg:col-span-8" : "lg:col-span-4"
                    } group relative`}
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <div
                      className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-full ${
                        hoveredEvent === event.id ? "scale-[1.02]" : ""
                      }`}
                    >
                      {/* Gradient Header - Taller for large cards */}
                      <div
                        className={`relative ${
                          isLarge ? "h-72" : "h-56"
                        } bg-gradient-to-br ${style.gradient} overflow-hidden`}
                      >
                        {/* Geometric Patterns */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-white rounded-full -translate-y-1/2 translate-x-1/2" />
                          <div className="absolute bottom-0 left-0 w-48 h-48 border-[30px] border-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <span
                            className={`inline-block px-5 py-2 ${style.badge} text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg`}
                          >
                            {event.category}
                          </span>
                        </div>

                        {/* Event Title */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                          <h3
                            className={`font-serif ${
                              isLarge ? "text-4xl" : "text-2xl"
                            } font-bold text-white leading-tight`}
                          >
                            {event.title}
                          </h3>
                        </div>

                        {/* Hover Glow Effect */}
                        <div
                          className={`absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <p className="text-gray-700 text-base leading-relaxed mb-8">
                          {event.description}
                        </p>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f1eb] flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-5 h-5 text-[#0d6d6e]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Date
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                {event.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f1eb] flex items-center justify-center flex-shrink-0">
                              <Clock className="w-5 h-5 text-[#0d6d6e]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Time
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                {event.time}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f1eb] flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 text-[#0d6d6e]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Location
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                {event.location}
                              </div>
                            </div>
                          </div>

                          {event.attendees && (
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#f5f1eb] flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-[#0d6d6e]" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                  Attending
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {event.attendees}+
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <button className="w-full bg-gradient-to-r from-[#0d6d6e] to-[#0a5556] text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#0d6d6e]/20 transition-all duration-300 flex items-center justify-center group">
                          <span>Register Now</span>
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - More Engaging */}
      <section className="py-32 bg-gradient-to-br from-[#2E3538] via-[#1E2528] to-[#2E3538] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0d6d6e] opacity-20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D6C3A9] opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-[#D6C3A9]" />
              <span className="text-sm font-medium text-white/90">
                Join Our Community
              </span>
            </div>

            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight">
              Ready to make
              <br />
              <span className="italic text-[#D6C3A9]">your mark?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Don't just attend events—be part of a movement shaping the future
              of women in technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#0d6d6e] to-[#0a5556] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#0d6d6e]/30 transition-all duration-300 hover:scale-105"
              >
                Get in Touch
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
              
              <a
                href="/about"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/30 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}