import React, { useState, useEffect } from 'react';
import './EventPlanner.css';


interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

const EventPlanner: React.FC = () => {
  
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

 
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 0 : value,
    }));
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing event
      setEvents(prev => 
        prev.map(event => 
          event.id === editingId ? { ...formData, id: editingId } : event
        )
      );
      setEditingId(null);
    } else {
      // Create new event
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      attendees: 0,
    });
  };

  
  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };


  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      attendees: event.attendees,
    });
    setEditingId(event.id);
  };

  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="event-planner-container">
      <h1 className="app-title">Event Management Planner</h1>
      
     
      <div className="form-container">
        <h2 className="form-title">
          {editingId ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Expected Attendees</label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    attendees: 0,
                  });
                }}
                className="button button-secondary"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="button button-primary"
            >
              {editingId ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Events List */}
      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events found. Add your first event above!</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
                <div className="event-actions">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="button-icon"
                    aria-label="Edit event"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="button-icon"
                    aria-label="Delete event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="event-details">
                <div className="event-detail">
                  <span className="event-icon">📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="event-detail">
                  <span className="event-icon">🕒</span>
                  <span>{event.time}</span>
                </div>
                <div className="event-detail">
                  <span className="event-icon">📍</span>
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="event-attendees">
                <span className="event-icon">👥</span>
                <span>{event.attendees} expected attendees</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventPlanner;