// context/EventContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Event } from '../types/event'; // your Event type
import { v4 as uuidv4 } from 'uuid';

type EventContextType = {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { id: uuidv4(), ...event };
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvent must be used within EventProvider');
  return context;
};
