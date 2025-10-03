import React, { useState, useEffect } from 'react';

// Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg className="w-6 h-6" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// Icons removed - SearchIcon and CalendarIcon no longer used

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Huskies Logo Component - Using real team logo
const HuskiesLogo = ({ size = "w-8 h-8" }) => (
  <div className={`${size} rounded-full overflow-hidden bg-white flex items-center justify-center`}>
    <img 
      src="/huskies-logo.jpg" 
      alt="Waldbronn Huskies 4" 
      className="w-full h-full object-cover"
    />
  </div>
);

// Environment variables for Airtable
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.REACT_APP_AIRTABLE_PAT;

// Check if we should use mock data (when env vars are not set)
const USE_MOCK_DATA = !AIRTABLE_BASE_ID || !AIRTABLE_PAT;

// Mock data storage (for demo/development)
let mockData = {
  events: [
    { id: 'mock-event-1', date: new Date().toISOString().split('T')[0], created: new Date().toISOString(), sponsors: 'Max, Peter' }
  ],
  beers: [
    { id: 'mock-beer-1', name: 'Augustiner Helles', brewery: 'Augustiner Bräu', style: 'Helles' },
    { id: 'mock-beer-2', name: 'Weihenstephaner Hefeweizen', brewery: 'Weihenstephaner', style: 'Weizen' }
  ],
  eventBeers: [
    { id: 'mock-eb-1', eventId: 'mock-event-1', beerId: 'mock-beer-1' }
  ],
  ratings: [
    { id: 'mock-rating-1', eventId: 'mock-event-1', beerId: 'mock-beer-1', raterName: 'Max', rating: 4, created: '2024-01-15T11:00:00Z' }
  ]
};

// Removed mockBeers - no longer needed with custom beer creation workflow

// API functions (real Airtable or mock)
const createApiClient = () => {
  if (USE_MOCK_DATA) {
    console.log('🎭 Using MOCK DATA - Set environment variables for real Airtable integration');
    
    return {
      async getRecords(tableName) {
        console.log(`📡 [MOCK] Fetching ${tableName}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const tableMap = {
          'Events': mockData.events.map(item => ({ id: item.id, fields: { Date: item.date, Created: item.created, Sponsor: item.sponsors } })),
          'Beers': mockData.beers.map(item => ({ id: item.id, fields: { Name: item.name, Brewery: item.brewery, Style: item.style } })),
          'Event_Beers': mockData.eventBeers.map(item => ({ id: item.id, fields: { Event: [item.eventId], Beer: [item.beerId] } })),
          'Ratings': mockData.ratings.map(item => ({ id: item.id, fields: { Event: [item.eventId], Beer: [item.beerId], Rater_Name: item.raterName, Rating: item.rating, Created: item.created } }))
        };
        
        return tableMap[tableName] || [];
      },

      async createRecord(tableName, fields) {
        console.log(`📝 [MOCK] Creating ${tableName} with:`, fields);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const id = `mock-${tableName.toLowerCase()}-${Date.now()}`;
        const created = new Date().toISOString();
        
        if (tableName === 'Events') {
          const newEvent = { id, date: fields.Date, created, sponsors: fields.Sponsor || '' };
          mockData.events.push(newEvent);
          return { id, fields: { Date: fields.Date, Created: created, Sponsor: fields.Sponsor || '' } };
        }
        
        if (tableName === 'Beers') {
          const newBeer = { id, name: fields.Name, brewery: fields.Brewery, style: fields.Style };
          mockData.beers.push(newBeer);
          return { id, fields: { Name: fields.Name, Brewery: fields.Brewery, Style: fields.Style } };
        }
        
        if (tableName === 'Event_Beers') {
          const newEventBeer = { id, eventId: fields.Event[0], beerId: fields.Beer[0] };
          mockData.eventBeers.push(newEventBeer);
          return { id, fields: { Event: fields.Event, Beer: fields.Beer } };
        }
        
        if (tableName === 'Ratings') {
          const newRating = { id, eventId: fields.Event[0], beerId: fields.Beer[0], raterName: fields.Rater_Name, rating: fields.Rating, created };
          mockData.ratings.push(newRating);
          return { id, fields: { Event: fields.Event, Beer: fields.Beer, Rater_Name: fields.Rater_Name, Rating: fields.Rating, Created: created } };
        }
        
        throw new Error(`Unknown table: ${tableName}`);
      },

      async updateRecord(tableName, recordId, fields) {
        console.log(`📝 [MOCK] Updating ${tableName}/${recordId} with:`, fields);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (tableName === 'Events') {
          const eventIndex = mockData.events.findIndex(e => e.id === recordId);
          if (eventIndex !== -1) {
            if (fields.Date !== undefined) mockData.events[eventIndex].date = fields.Date;
            if (fields.Sponsor !== undefined) mockData.events[eventIndex].sponsors = fields.Sponsor;
            return { id: recordId, fields: { Date: mockData.events[eventIndex].date, Sponsor: mockData.events[eventIndex].sponsors } };
          }
        }
        
        throw new Error(`Record not found: ${tableName}/${recordId}`);
      }
    };
  } else {
    console.log('🗄️ Using REAL AIRTABLE integration');
    
    return {
      async getRecords(tableName) {
        console.log(`📡 Fetching ${tableName} from Airtable...`);
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        return data.records || [];
      },

      async createRecord(tableName, fields) {
        console.log(`📝 Creating ${tableName} in Airtable with:`, fields);
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        
        return await response.json();
      },

      async updateRecord(tableName, recordId, fields) {
        console.log(`📝 Updating ${tableName}/${recordId} in Airtable with:`, fields);
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}/${recordId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        
        return await response.json();
      }
    };
  }
};

const airtableApi = createApiClient();

function App() {
  const [currentView, setCurrentView] = useState('home'); // Changed default to 'home'
  const [events, setEvents] = useState([]);
  const [beers, setBeers] = useState([]);
  const [eventBeers, setEventBeers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [raterName, setRaterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showCreateBeer, setShowCreateBeer] = useState(false);
  const [newBeer, setNewBeer] = useState({ name: '', brewery: '', style: '', type: 'Bier' });
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [statsSearchTerm, setStatsSearchTerm] = useState('');
  const [showSponsorSignup, setShowSponsorSignup] = useState(false);
  const [selectedEventForSignup, setSelectedEventForSignup] = useState(null);
  const [sponsorName, setSponsorName] = useState('');
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [editEventData, setEditEventData] = useState({ date: '', sponsors: '' });
  const [newEventSponsors, setNewEventSponsors] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Load all data on app start
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [eventsData, beersData, eventBeersData, ratingsData] = await Promise.all([
        airtableApi.getRecords('Events'),
        airtableApi.getRecords('Beers'),
        airtableApi.getRecords('Event_Beers'),
        airtableApi.getRecords('Ratings')
      ]);

      setEvents(eventsData.map(record => ({
        id: record.id,
        date: record.fields.Date,
        created: record.fields.Created,
        sponsors: record.fields.Sponsor || ''
      })));

      setBeers(beersData.map(record => ({
        id: record.id,
        name: record.fields.Name,
        brewery: record.fields.Brewery,
        style: record.fields.Style,
        apiId: record.fields.API_ID
      })));

      setEventBeers(eventBeersData.map(record => ({
        id: record.id,
        eventId: record.fields.Event?.[0],
        beerId: record.fields.Beer?.[0]
      })));

      setRatings(ratingsData.map(record => ({
        id: record.id,
        eventId: record.fields.Event?.[0],
        beerId: record.fields.Beer?.[0],
        raterName: record.fields.Rater_Name,
        rating: record.fields.Rating,
        notes: record.fields.Notes,
        created: record.fields.Created
      })));

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Removed searchBeers function - no longer needed with new custom beer workflow

  const createEvent = async (date, sponsors = '') => {
    console.log('🚀 Starting createEvent with date:', date, 'sponsors:', sponsors);
    setSubmitLoading(true);
    
    try {
      console.log('📡 Calling API...');
      const result = await airtableApi.createRecord('Events', {
        Date: date,
        Sponsor: sponsors
      });
      
      console.log('📥 API result:', result);
      
      if (result && result.id) {
        const newEvent = {
          id: result.id,
          date: result.fields.Date,
          created: result.fields.Created,
          sponsors: result.fields.Sponsor || ''
        };
        console.log('✅ New event created:', newEvent);
        
        setEvents(prevEvents => {
          const updatedEvents = [...prevEvents, newEvent];
          return updatedEvents;
        });
        
        setSelectedDate('');
        setCurrentView('events');
        
        alert('✅ Event erfolgreich erstellt!');
        
      } else {
        console.error('❌ No result or ID returned:', result);
        alert('❌ Fehler: Keine ID vom Server erhalten');
      }
    } catch (error) {
      console.error('💥 Error creating event:', error);
      alert('💥 Fehler beim Erstellen: ' + error.message);
    } finally {
      console.log('🏁 Finishing createEvent, setting loading to false');
      setSubmitLoading(false);
    }
  };

  const addSponsorToEvent = async (eventId, newSponsorName) => {
    if (!newSponsorName.trim()) {
      alert('Bitte gib deinen Namen ein!');
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) {
      alert('Event nicht gefunden!');
      return;
    }

    const currentSponsors = event.sponsors || '';
    const sponsorList = currentSponsors.split(',').map(s => s.trim()).filter(Boolean);
    
    if (sponsorList.includes(newSponsorName.trim())) {
      alert('Du bist bereits als Bierspender eingetragen!');
      return;
    }

    sponsorList.push(newSponsorName.trim());
    const newSponsors = sponsorList.join(', ');

    setSubmitLoading(true);
    try {
      await airtableApi.updateRecord('Events', eventId, {
        Sponsor: newSponsors
      });

      setEvents(events.map(e => 
        e.id === eventId ? {...e, sponsors: newSponsors} : e
      ));

      alert('✅ Erfolgreich als Bierspender angemeldet!');
      setShowSponsorSignup(false);
      setSponsorName('');
      setSelectedEventForSignup(null);
    } catch (error) {
      console.error('Error adding sponsor:', error);
      alert('Fehler beim Anmelden als Bierspender');
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateEvent = async (eventId, date, sponsors) => {
    setSubmitLoading(true);
    try {
      await airtableApi.updateRecord('Events', eventId, {
        Date: date,
        Sponsor: sponsors
      });

      setEvents(events.map(e => 
        e.id === eventId ? {...e, date, sponsors} : e
      ));

      alert('✅ Event erfolgreich aktualisiert!');
      setShowEditEvent(false);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Fehler beim Aktualisieren des Events');
    } finally {
      setSubmitLoading(false);
    }
  };

  const createCustomBeer = async () => {
    if (!newBeer.name.trim() || !newBeer.brewery.trim()) {
      alert('Bitte gib mindestens Name und Brauerei ein!');
      return;
    }

    // Check for duplicates across all events
    const duplicateBeer = beers.find(b => 
      b.name.toLowerCase() === newBeer.name.trim().toLowerCase() && 
      b.brewery.toLowerCase() === newBeer.brewery.trim().toLowerCase()
    );

    if (duplicateBeer) {
      const confirm = window.confirm(`"${newBeer.name}" von ${newBeer.brewery} wurde bereits früher serviert. Trotzdem hinzufügen?`);
      if (!confirm) return;
    }

    setSubmitLoading(true);
    try {
      const beerResult = await airtableApi.createRecord('Beers', {
        Name: newBeer.name.trim(),
        Brewery: newBeer.brewery.trim(),
        Style: newBeer.style.trim() || newBeer.type,
        API_ID: `custom-${Date.now()}`
      });
      
      if (beerResult) {
        const createdBeer = {
          id: beerResult.id,
          name: beerResult.fields.Name,
          brewery: beerResult.fields.Brewery,
          style: beerResult.fields.Style,
          apiId: beerResult.fields.API_ID
        };
        setBeers([...beers, createdBeer]);

        // Add to current event
        if (selectedEvent) {
          const eventBeerResult = await airtableApi.createRecord('Event_Beers', {
            Event: [selectedEvent.id],
            Beer: [createdBeer.id]
          });

          if (eventBeerResult) {
            const newEventBeer = {
              id: eventBeerResult.id,
              eventId: selectedEvent.id,
              beerId: createdBeer.id
            };
            setEventBeers([...eventBeers, newEventBeer]);
          }
        }

        // Reset form and close modal
        setNewBeer({ name: '', brewery: '', style: '', type: 'Bier' });
        setShowCreateBeer(false);
        
        alert(`✅ ${createdBeer.name} erfolgreich hinzugefügt!`);
      }
    } catch (error) {
      console.error('Error creating custom beer:', error);
      alert('Fehler beim Hinzufügen des Getränks');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get all previously served beers for duplicate detection
  const getPreviouslyServedBeers = () => {
    const servedBeerIds = eventBeers.map(eb => eb.beerId);
    return beers.filter(beer => servedBeerIds.includes(beer.id));
  };

  // Get today's event (only events with date === today)
  const getTodaysEvent = () => {
    if (events.length === 0) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.find(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  };

  // Get upcoming events (future dates)
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() > today.getTime();
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get past events (historical dates)
  const getPastEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() < today.getTime();
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Get the most recent event (kept for backward compatibility)
  const getMostRecentEvent = () => {
    if (events.length === 0) return null;
    return events.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  // Get appropriate event title based on date
  const getEventTitle = (event) => {
    if (!event) return "Event";
    
    const eventDate = new Date(event.date);
    const today = new Date();
    
    // Reset time to compare only dates
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Heutiges Event";
    } else if (diffDays === 1) {
      return "Morgiges Event";
    } else if (diffDays > 1) {
      return "Nächstes Event";
    } else if (diffDays === -1) {
      return "Letztes Event";
    } else {
      return "Vergangenes Event";
    }
  };

  // Get user's ratings for today's event
  const getTodaysRatings = (eventId) => {
    if (!raterName.trim() || !eventId) return [];
    return ratings.filter(r => r.eventId === eventId && r.raterName === raterName);
  };

  // Removed addBeerToEvent function - functionality moved to createCustomBeer

  const submitRating = async (beerId, rating) => {
    if (!raterName.trim()) {
      alert('Bitte gib deinen Namen ein!');
      return;
    }

    // Get the current event - either selectedEvent or most recent event
    const currentEvent = selectedEvent || getMostRecentEvent();
    if (!currentEvent) {
      alert('Kein Event gefunden!');
      return;
    }

    setSubmitLoading(true);
    try {
      const existingRating = ratings.find(r => 
        r.eventId === currentEvent.id && 
        r.beerId === beerId && 
        r.raterName === raterName
      );

      if (existingRating) {
        alert('Du hast dieses Getränk bereits bewertet!');
      } else {
        const ratingResult = await airtableApi.createRecord('Ratings', {
          Event: [currentEvent.id],
          Beer: [beerId],
          Rater_Name: raterName,
          Rating: rating
        });

        if (ratingResult) {
          const newRating = {
            id: ratingResult.id,
            eventId: currentEvent.id,
            beerId: beerId,
            raterName: raterName,
            rating: rating,
            notes: '',
            created: ratingResult.fields.Created
          };
          setRatings([...ratings, newRating]);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Fehler beim Speichern der Bewertung');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getEventBeersForEvent = (eventId) => {
    const eventBeerIds = eventBeers
      .filter(eb => eb.eventId === eventId)
      .map(eb => eb.beerId);
    
    return beers.filter(beer => eventBeerIds.includes(beer.id));
  };

  const getRatingsForBeer = (eventId, beerId) => {
    return ratings.filter(r => r.eventId === eventId && r.beerId === beerId);
  };

  // Get all ratings for a beer across all events
  const getAllRatingsForBeer = (beerId) => {
    return ratings.filter(r => r.beerId === beerId);
  };

  const getAverageRating = (eventId, beerId) => {
    const beerRatings = getRatingsForBeer(eventId, beerId);
    if (beerRatings.length === 0) return 0;
    const sum = beerRatings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / beerRatings.length).toFixed(1);
  };

  const getRatingsCount = (eventId, beerId) => {
    return getRatingsForBeer(eventId, beerId).length;
  };

  const StarRating = ({ beerId, currentRating, onRate, readonly = false }) => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={readonly || submitLoading}
            className={`${
              star <= (hover || currentRating) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${!readonly ? 'hover:text-yellow-300' : ''} ${readonly ? 'cursor-default' : ''}`}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => !readonly && onRate && onRate(star)}
          >
            <StarIcon filled={star <= (hover || currentRating)} />
          </button>
        ))}
      </div>
    );
  };

  // Header Component
  const Header = ({ title, showBack = false, actions = [] }) => (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <BackIcon />
              </button>
            )}
            <HuskiesLogo />
            <div>
              <h1 className="text-lg font-bold text-blue-900">{title}</h1>
              <p className="text-sm text-blue-700">Waldbronn Huskies 4</p>
            </div>
          </div>
          <div className="flex gap-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={submitLoading}
                className={`${action.className} px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1 disabled:opacity-50`}
              >
                {submitLoading ? <LoadingIcon /> : action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 text-center">
          <HuskiesLogo size="w-24 h-24" />
          <h1 className="text-xl font-bold text-white mt-4 mb-2">Waldbronn Huskies 4</h1>
          <h2 className="text-lg text-white text-opacity-80 mb-4">Beer Rating</h2>
          <div className="flex items-center justify-center gap-2 text-white">
            <LoadingIcon />
            <span>Lade Daten...</span>
          </div>
          {USE_MOCK_DATA && (
            <p className="text-white text-opacity-70 text-sm mt-2">
              Demo-Modus (Mock-Daten)
            </p>
          )}
        </div>
      </div>
    );
  }

  // Beer Details View
  if (currentView === 'beerDetails') {
    const beerId = selectedBeer.id;
    const beerRatings = getAllRatingsForBeer(beerId);
    const avgRating = beerRatings.length > 0 ? (beerRatings.reduce((acc, r) => acc + r.rating, 0) / beerRatings.length).toFixed(1) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header 
          title="Bewertungsdetails" 
          showBack={true}
        />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-4">
              <h2 className="text-xl font-bold text-white mb-2">{selectedBeer.name}</h2>
              <p className="text-white text-opacity-80 mb-4">{selectedBeer.brewery} • {selectedBeer.style}</p>
              
              <div className="flex items-center gap-3 mb-6">
                <StarRating currentRating={Math.round(avgRating)} readonly={true} />
                <span className="text-white font-semibold">{avgRating}/5</span>
                <span className="text-white text-opacity-70">({beerRatings.length} Bewertungen)</span>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Einzelbewertungen</h3>
              
              {beerRatings.length === 0 ? (
                <p className="text-white text-opacity-70 text-center py-4">
                  Noch keine Bewertungen vorhanden
                </p>
              ) : (
                <div className="space-y-3">
                  {beerRatings.map((rating) => {
                    const ratingEvent = events.find(e => e.id === rating.eventId);
                    const eventDate = ratingEvent ? new Date(ratingEvent.date).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Unbekannt';
                    
                    return (
                      <div key={rating.id} className="bg-white bg-opacity-10 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="text-white font-medium">{rating.raterName}</span>
                            <div className="text-white text-opacity-60 text-xs mt-1">
                              Event vom {eventDate}
                            </div>
                            {ratingEvent && ratingEvent.sponsors && (
                              <div className="text-white text-opacity-50 text-xs mt-1">
                                🍺 {ratingEvent.sponsors}
                              </div>
                            )}
                          </div>
                          <StarRating currentRating={rating.rating} readonly={true} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Event Details View - Enhanced for team workflow
  if (currentView === 'eventDetails') {
    const eventId = selectedEvent.id;
    const eventBeersList = getEventBeersForEvent(eventId);
    const totalRatings = eventBeersList.reduce((sum, beer) => sum + getRatingsCount(eventId, beer.id), 0);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header 
          title="Event Details" 
          showBack={true}
          actions={[
            {
              label: '⚙️',
              icon: null,
              className: 'bg-gray-600 hover:bg-gray-700 text-white',
              onClick: () => {
                setEditEventData({ date: selectedEvent.date, sponsors: selectedEvent.sponsors || '' });
                setShowEditEvent(true);
              }
            }
          ]}
        />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            
            {/* Event Info */}
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-3">
                🏒 {new Date(selectedEvent.date).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              
              {/* Bierspender Info */}
              <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
                <div className="text-white text-sm font-semibold mb-2">🍺 Bierspender:</div>
                {selectedEvent.sponsors ? (
                  <div className="text-white font-semibold">{selectedEvent.sponsors}</div>
                ) : (
                  <div className="text-white text-opacity-70 italic">Keine Bierspender angegeben</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{eventBeersList.length}</div>
                  <div className="text-white text-opacity-70 text-sm">Getränke serviert</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalRatings}</div>
                  <div className="text-white text-opacity-70 text-sm">Team-Bewertungen</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setCurrentView('addBeers')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PlusIcon />
                Getränke
              </button>
              <button
                onClick={() => {
                  if (eventBeersList.length === 0) {
                    alert('Erst Getränke zum Event hinzufügen!');
                    return;
                  }
                  setCurrentView('rateBeers');
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <StarIcon filled={true} />
                Bewerten
              </button>
            </div>
            
            {eventBeersList.length === 0 ? (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🍺</div>
                <h3 className="text-lg font-bold text-white mb-2">Noch keine Getränke</h3>
                <p className="text-white text-opacity-70">
                  Füge Getränke für dieses Event hinzu um loszulegen.
                </p>
              </div>
            ) : (
              <>
                {/* Beer List */}
                <div className="space-y-3">
                  {eventBeersList.map((beer) => {
                    const avgRating = getAverageRating(eventId, beer.id);
                    const ratingsCount = getRatingsCount(eventId, beer.id);
                    
                    return (
                      <div 
                        key={beer.id} 
                        className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 cursor-pointer hover:bg-opacity-20 transition-all"
                        onClick={() => {
                          setSelectedBeer(beer);
                          setCurrentView('beerDetails');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{beer.name}</h3>
                            <p className="text-sm text-white text-opacity-80">{beer.brewery}</p>
                            <p className="text-xs text-white text-opacity-60">{beer.style}</p>
                          </div>
                          <div className="text-right">
                            {ratingsCount > 0 ? (
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                  <StarRating currentRating={Math.round(avgRating)} readonly={true} />
                                </div>
                                <p className="text-white text-sm font-semibold">{avgRating}/5</p>
                                <p className="text-white text-opacity-70 text-xs">
                                  {ratingsCount} {ratingsCount === 1 ? 'Bewertung' : 'Bewertungen'}
                                </p>
                              </>
                            ) : (
                              <div className="bg-gray-600 bg-opacity-50 px-3 py-1 rounded-full">
                                <p className="text-white text-opacity-70 text-xs">Noch nicht bewertet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Edit Event Modal */}
        {showEditEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-blue-900 mb-6">⚙️ Event bearbeiten</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">Datum</label>
                  <input
                    type="date"
                    value={editEventData.date}
                    onChange={(e) => setEditEventData({...editEventData, date: e.target.value})}
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">
                    🍺 Bierspender
                  </label>
                  <input
                    type="text"
                    value={editEventData.sponsors}
                    onChange={(e) => setEditEventData({...editEventData, sponsors: e.target.value})}
                    placeholder="z.B. Max, Peter, Julia"
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-lg"
                  />
                  <p className="text-gray-600 text-sm mt-2">
                    Namen mit Komma trennen
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditEvent(false);
                    setEditEventData({ date: '', sponsors: '' });
                  }}
                  disabled={submitLoading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => updateEvent(selectedEvent.id, editEventData.date, editEventData.sponsors)}
                  disabled={!editEventData.date || submitLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <LoadingIcon />
                      Wird gespeichert...
                    </>
                  ) : (
                    'Speichern'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Create Event View
  if (currentView === 'createEvent') {
    const handleCreateEvent = async () => {
      if (!selectedDate) {
        alert('Bitte wähle ein Datum aus!');
        return;
      }
      console.log('Creating event with date:', selectedDate, 'sponsors:', newEventSponsors);
      await createEvent(selectedDate, newEventSponsors);
      setNewEventSponsors('');
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header title="Neues Event" showBack={true} />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">Datum auswählen</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={submitLoading}
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white text-lg disabled:opacity-50"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">
                  🍺 Bierspender (optional)
                </label>
                <input
                  type="text"
                  value={newEventSponsors}
                  onChange={(e) => setNewEventSponsors(e.target.value)}
                  disabled={submitLoading}
                  placeholder="z.B. Max, Peter, Julia"
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white text-lg placeholder-white placeholder-opacity-50 disabled:opacity-50"
                />
                <p className="text-white text-opacity-70 text-sm mt-2">
                  Namen mit Komma trennen
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCreateEvent}
                  disabled={!selectedDate || submitLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <LoadingIcon />
                      Event wird erstellt...
                    </>
                  ) : (
                    <>
                      <PlusIcon />
                      Event erstellen
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setSelectedDate('');
                    setCurrentView('events');
                  }}
                  disabled={submitLoading}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add Beers View - Redesigned for Huskies team workflow
  if (currentView === 'addBeers') {
    const currentEventBeers = getEventBeersForEvent(selectedEvent?.id || '');
    const previouslyServedBeers = getPreviouslyServedBeers();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header title="Getränke hinzufügen" showBack={true} />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            
            {/* Primary Action - Add Custom Beer */}
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">🍺 Neue Getränke hinzufügen</h3>
                <p className="text-white text-opacity-80 mb-4">
                  Welche Getränke hast du heute mitgebracht?
                </p>
                <button
                  onClick={() => setShowCreateBeer(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
                >
                  <PlusIcon />
                  Getränk hinzufügen
                </button>
              </div>
            </div>

            {/* Today's Beers */}
            {currentEventBeers.length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  🍻 Heute serviert ({currentEventBeers.length})
                </h3>
                <div className="space-y-3">
                  {currentEventBeers.map((beer) => (
                    <div key={beer.id} className="bg-green-600 bg-opacity-30 rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{beer.name}</h4>
                          <p className="text-white text-opacity-80 text-sm">{beer.brewery}</p>
                          <p className="text-white text-opacity-60 text-xs">{beer.style}</p>
                        </div>
                        <div className="bg-green-600 p-2 rounded-lg">
                          <span className="text-white">✓</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previously Served Warning */}
            {previouslyServedBeers.length > 0 && (
              <div className="bg-yellow-600 bg-opacity-20 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  ⚠️ Bereits serviert
                </h3>
                <p className="text-white text-opacity-80 text-sm mb-4">
                  Diese Getränke wurden bereits bei früheren Events serviert:
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {previouslyServedBeers.slice(0, 10).map((beer) => (
                    <div key={beer.id} className="bg-yellow-600 bg-opacity-30 rounded-lg p-3">
                      <p className="font-medium text-white text-sm">{beer.name}</p>
                      <p className="text-white text-opacity-70 text-xs">{beer.brewery}</p>
                    </div>
                  ))}
                  {previouslyServedBeers.length > 10 && (
                    <p className="text-white text-opacity-60 text-xs text-center">
                      ... und {previouslyServedBeers.length - 10} weitere
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Create Custom Beer Modal */}
        {showCreateBeer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-blue-900 mb-6">🍺 Getränk hinzufügen</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">
                    Art des Getränks *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setNewBeer({...newBeer, type: 'Bier'})}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newBeer.type === 'Bier' 
                          ? 'border-blue-600 bg-blue-50 text-blue-900' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      🍺 Bier
                    </button>
                    <button
                      onClick={() => setNewBeer({...newBeer, type: 'Sekt'})}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newBeer.type === 'Sekt' 
                          ? 'border-blue-600 bg-blue-50 text-blue-900' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      🥂 Sekt
                    </button>
                    <button
                      onClick={() => setNewBeer({...newBeer, type: 'Sonstiges'})}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newBeer.type === 'Sonstiges' 
                          ? 'border-blue-600 bg-blue-50 text-blue-900' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      🍹 Sonstiges
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">
                    Name des Getränks *
                  </label>
                  <input
                    type="text"
                    value={newBeer.name}
                    onChange={(e) => setNewBeer({...newBeer, name: e.target.value})}
                    placeholder="z.B. Augustiner Helles"
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">
                    Brauerei / Hersteller *
                  </label>
                  <input
                    type="text"
                    value={newBeer.brewery}
                    onChange={(e) => setNewBeer({...newBeer, brewery: e.target.value})}
                    placeholder="z.B. Augustiner Bräu"
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-900">
                    Stil / Typ (optional)
                  </label>
                  <input
                    type="text"
                    value={newBeer.style}
                    onChange={(e) => setNewBeer({...newBeer, style: e.target.value})}
                    placeholder="z.B. Helles, Weizen, Pilsner"
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateBeer(false);
                    setNewBeer({ name: '', brewery: '', style: '', type: 'Bier' });
                  }}
                  disabled={submitLoading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={createCustomBeer}
                  disabled={!newBeer.name.trim() || !newBeer.brewery.trim() || submitLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <LoadingIcon />
                      Wird hinzugefügt...
                    </>
                  ) : (
                    <>
                      <PlusIcon />
                      Hinzufügen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Rate Beers View - Enhanced for previous events
  if (currentView === 'rateBeers') {
    const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentEventBeers = selectedEvent ? getEventBeersForEvent(selectedEvent.id) : [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header title="Nachträglich bewerten" showBack={true} />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Name Input */}
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4">
              <label className="block text-sm font-medium mb-2 text-white">Dein Name</label>
              <input
                type="text"
                value={raterName}
                onChange={(e) => setRaterName(e.target.value)}
                placeholder="Name eingeben..."
                className="w-full p-3 rounded-lg bg-white bg-opacity-90 border-0 text-gray-900 placeholder-gray-500 text-lg"
              />
            </div>
            
            {!selectedEvent ? (
              /* Event Selection */
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📅 Event auswählen</h3>
                <p className="text-white text-opacity-80 text-sm mb-4">
                  Wähle ein vergangenes Event aus, für das du noch Getränke bewerten möchtest:
                </p>
                
                <div className="space-y-3">
                  {sortedEvents.map((event) => {
                    const eventBeers = getEventBeersForEvent(event.id);
                    const eventDate = new Date(event.date).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                    
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-4 text-left transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-white">{getEventTitle(event)}</div>
                            <div className="text-white text-opacity-80 text-sm">{eventDate}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{eventBeers.length}</div>
                            <div className="text-white text-opacity-60 text-xs">Getränke</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Rating Interface for Selected Event */
              <>
                <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{getEventTitle(selectedEvent)}</h3>
                      <p className="text-white text-opacity-80 text-sm">
                        {new Date(selectedEvent.date).toLocaleDateString('de-DE', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      Anderes Event
                    </button>
                  </div>
                </div>
                
                {currentEventBeers.length === 0 ? (
                  <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 text-center">
                    <p className="text-white text-opacity-70">Keine Getränke für dieses Event gefunden</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentEventBeers.map((beer) => {
                      const existingRating = ratings.find(r => 
                        r.eventId === selectedEvent.id && 
                        r.beerId === beer.id && 
                        r.raterName === raterName
                      );
                      const currentRating = existingRating?.rating || 0;
                      
                      return (
                        <div key={beer.id} className={`rounded-xl p-4 transition-all ${
                          currentRating > 0 
                            ? 'bg-green-600 bg-opacity-30 border-2 border-green-400' 
                            : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                        }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-white">{beer.name}</h4>
                              <p className="text-white text-opacity-80 text-sm">{beer.brewery}</p>
                              <p className="text-white text-opacity-60 text-xs">{beer.style}</p>
                            </div>
                            {currentRating > 0 && (
                              <div className="bg-green-600 px-3 py-1 rounded-full">
                                <span className="text-white font-bold">✓ {currentRating}★</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm">Bewertung:</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  disabled={!raterName.trim() || submitLoading}
                                  onClick={() => submitRating(beer.id, star)}
                                  className={`w-10 h-10 rounded-full border-2 transition-all disabled:opacity-50 ${
                                    star <= currentRating
                                      ? 'bg-yellow-400 border-yellow-400 text-yellow-900'
                                      : 'border-white border-opacity-30 text-white hover:border-yellow-400 hover:text-yellow-400'
                                  }`}
                                >
                                  <span className="font-bold text-lg">{star}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Statistics View (Secondary Use Case)
  if (currentView === 'statistics') {
    // Calculate overall statistics
    const allServedBeers = getPreviouslyServedBeers();
    const allRatings = ratings.filter(r => r.rating > 0);
    
    // Filter beers based on search term
    const filteredBeers = allServedBeers.filter(beer =>
      beer.name.toLowerCase().includes(statsSearchTerm.toLowerCase()) ||
      beer.brewery.toLowerCase().includes(statsSearchTerm.toLowerCase()) ||
      beer.style.toLowerCase().includes(statsSearchTerm.toLowerCase())
    );
    
    // Get top-rated beers (minimum 1 rating)
    const beerStats = allServedBeers.map(beer => {
      const beerRatings = allRatings.filter(r => r.beerId === beer.id);
      const avgRating = beerRatings.length > 0 
        ? beerRatings.reduce((sum, r) => sum + r.rating, 0) / beerRatings.length 
        : 0;
      return {
        ...beer,
        avgRating,
        ratingsCount: beerRatings.length
      };
    }).filter(beer => beer.ratingsCount >= 1)
      .sort((a, b) => b.avgRating - a.avgRating);

    // Get most active raters
    const raterStats = {};
    allRatings.forEach(rating => {
      if (!raterStats[rating.raterName]) {
        raterStats[rating.raterName] = { count: 0, totalRating: 0 };
      }
      raterStats[rating.raterName].count++;
      raterStats[rating.raterName].totalRating += rating.rating;
    });
    
    const topRaters = Object.entries(raterStats)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avgRating: stats.totalRating / stats.count
      }))
      .sort((a, b) => b.count - a.count);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header title="📊 Team Statistiken" showBack={true} />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Overall Stats */}
            <div className="bg-white bg-opacity-15 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <HuskiesLogo size="w-12 h-12" />
                <div>
                  <h3 className="text-xl font-bold text-white">Team Statistics</h3>
                  <p className="text-white text-opacity-80 text-sm">Waldbronn Huskies 4</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{allServedBeers.length}</div>
                  <div className="text-white text-opacity-70 text-sm">Getränke serviert</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{allRatings.length}</div>
                  <div className="text-white text-opacity-70 text-sm">Team-Bewertungen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{events.length}</div>
                  <div className="text-white text-opacity-70 text-sm">Events</div>
                </div>
              </div>
            </div>

            {/* Top Rated Beers Hall of Fame */}
            {beerStats.length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">🏆 Hall of Fame - Top Getränke</h3>
                <div className="space-y-3">
                  {beerStats.slice(0, 8).map((beer, index) => (
                    <div key={beer.id} className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-xl">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-600' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : 'bg-blue-600'
                      }`}>
                        <span className="text-white font-bold text-sm">
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{beer.name}</div>
                        <div className="text-white text-opacity-80 text-xs">{beer.brewery}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{beer.avgRating.toFixed(1)}⭐</div>
                        <div className="text-white text-opacity-60 text-xs">({beer.ratingsCount} votes)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Most Active Raters Leaderboard */}
            {topRaters.length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">👥 Team Leaderboard</h3>
                <div className="space-y-3">
                  {topRaters.slice(0, 8).map((rater, index) => (
                    <div key={rater.name} className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="font-semibold text-white">{rater.name}</div>
                        {index === 0 && <span className="text-yellow-400">👑</span>}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{rater.count}</div>
                        <div className="text-white text-opacity-70 text-xs">Bewertungen</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beer Search & History */}
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🔍 Getränke-Historie durchsuchen</h3>
              
              {/* Search Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Nach Getränk, Brauerei oder Stil suchen..."
                  value={statsSearchTerm}
                  onChange={(e) => setStatsSearchTerm(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white bg-opacity-20 border-0 text-white placeholder-white placeholder-opacity-60 text-lg"
                />
                {statsSearchTerm && (
                  <button
                    onClick={() => setStatsSearchTerm('')}
                    className="absolute right-3 top-3 text-white text-opacity-60 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results / All Beers */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredBeers.length > 0 ? (
                  filteredBeers.map((beer) => {
                    const beerRating = beerStats.find(b => b.id === beer.id);
                    return (
                      <div 
                        key={beer.id} 
                        className="bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedBeer(beer);
                          setCurrentView('beerDetails');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">{beer.name}</div>
                            <div className="text-white text-opacity-80 text-xs">{beer.brewery} • {beer.style}</div>
                          </div>
                          {beerRating && beerRating.ratingsCount > 0 && (
                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">{beerRating.avgRating.toFixed(1)}⭐</div>
                              <div className="text-white text-opacity-60 text-xs">({beerRating.ratingsCount})</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white text-opacity-70">
                      {statsSearchTerm ? 'Keine Getränke gefunden' : 'Noch keine Getränke serviert'}
                    </p>
                  </div>
                )}
              </div>
              
              {filteredBeers.length > 0 && (
                <div className="text-center mt-4">
                  <p className="text-white text-opacity-60 text-sm">
                    {filteredBeers.length} von {allServedBeers.length} Getränken{statsSearchTerm ? ' gefunden' : ''}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // EVENTS VIEW - Public view of all events with signup
  if (currentView === 'events') {
    const todaysEvent = getTodaysEvent();
    const upcomingEvents = getUpcomingEvents();
    const pastEvents = getPastEvents();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header 
          title="📅 Events" 
          showBack={true}
        />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Today's Event */}
            {todaysEvent && (
              <div className="bg-gradient-to-br from-green-600 to-green-700 bg-opacity-20 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏒</span>
                  <h3 className="text-xl font-bold text-white">Heutiges Event</h3>
                </div>
                <p className="text-white text-opacity-90 font-semibold mb-3">
                  {new Date(todaysEvent.date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                
                <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
                  <div className="text-white text-sm font-semibold mb-2">🍺 Bierspender:</div>
                  {todaysEvent.sponsors ? (
                    <div className="text-white font-semibold">{todaysEvent.sponsors}</div>
                  ) : (
                    <div className="text-white text-opacity-70 italic">Noch keine Bierspender</div>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedEvent(todaysEvent);
                    setCurrentView('eventDetails');
                  }}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                >
                  Event Details ansehen
                </button>
              </div>
            )}
            
            {/* Upcoming Events */}
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📅</span>
                <h3 className="text-lg font-bold text-white">Kommende Events</h3>
              </div>
              
              {upcomingEvents.length === 0 ? (
                <p className="text-white text-opacity-70 text-center py-4">
                  Keine kommenden Events geplant
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const eventBeersCount = getEventBeersForEvent(event.id).length;
                    const hasSponsor = event.sponsors && event.sponsors.trim();
                    
                    return (
                      <div key={event.id} className="bg-white bg-opacity-10 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-white font-semibold">
                              {new Date(event.date).toLocaleDateString('de-DE', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-white text-opacity-70 text-sm mt-1">
                              {eventBeersCount > 0 ? `${eventBeersCount} Getränke` : 'Noch keine Getränke'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-3">
                          <div className="text-white text-xs font-semibold mb-1">🍺 Bierspender:</div>
                          {hasSponsor ? (
                            <div className="text-white text-sm">{event.sponsors}</div>
                          ) : (
                            <div className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
                              <span>⚠️</span> Suchen noch Bierspender!
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedEventForSignup(event);
                            setShowSponsorSignup(true);
                          }}
                          disabled={hasSponsor}
                          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                            hasSponsor 
                              ? 'bg-gray-500 text-white opacity-60 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {hasSponsor ? '✓ Bierspender vorhanden' : 'Als Bierspender anmelden'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6">
                <button
                  onClick={() => setShowPastEvents(!showPastEvents)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📜</span>
                    <h3 className="text-lg font-bold text-white">Vergangene Events</h3>
                    <span className="text-white text-opacity-70 text-sm">({pastEvents.length})</span>
                  </div>
                  <span className="text-white text-2xl">{showPastEvents ? '▼' : '▶'}</span>
                </button>
                
                {showPastEvents && (
                  <div className="space-y-3 mt-4">
                    {pastEvents.slice(0, 10).map((event) => {
                      const eventBeersCount = getEventBeersForEvent(event.id).length;
                      const ratingsCount = eventBeers
                        .filter(eb => eb.eventId === event.id)
                        .reduce((sum, eb) => sum + getRatingsCount(event.id, eb.beerId), 0);
                      
                      return (
                        <div 
                          key={event.id} 
                          className="bg-white bg-opacity-10 rounded-xl p-4 cursor-pointer hover:bg-opacity-20 transition-colors"
                          onClick={() => {
                            setSelectedEvent(event);
                            setCurrentView('eventDetails');
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-white font-semibold text-sm">
                                {new Date(event.date).toLocaleDateString('de-DE', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                              {event.sponsors && (
                                <div className="text-white text-opacity-70 text-xs mt-1">
                                  🍺 {event.sponsors}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-white text-sm">{eventBeersCount} Getränke</div>
                              <div className="text-white text-opacity-70 text-xs">{ratingsCount} Bewertungen</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
        
        {/* Sponsor Signup Modal */}
        {showSponsorSignup && selectedEventForSignup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-blue-900 mb-6">🍺 Als Bierspender anmelden</h3>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-blue-900 font-semibold mb-1">Event:</div>
                <div className="text-blue-900">
                  {new Date(selectedEventForSignup.date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                
                {selectedEventForSignup.sponsors && (
                  <div className="mt-3">
                    <div className="text-xs text-blue-700 mb-1">Aktuelle Bierspender:</div>
                    <div className="text-sm text-blue-900">{selectedEventForSignup.sponsors}</div>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-blue-900">Dein Name</label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Name eingeben..."
                  className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-lg"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSponsorSignup(false);
                    setSponsorName('');
                    setSelectedEventForSignup(null);
                  }}
                  disabled={submitLoading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => addSponsorToEvent(selectedEventForSignup.id, sponsorName)}
                  disabled={!sponsorName.trim() || submitLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <LoadingIcon />
                      Wird angemeldet...
                    </>
                  ) : (
                    'Anmelden'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // HOME SCREEN - Today's Event Focus (Primary Use Case)
  if (currentView === 'home') {
    const todaysEvent = getTodaysEvent();
    const eventBeers = todaysEvent ? getEventBeersForEvent(todaysEvent.id) : [];
    const myRatings = todaysEvent ? getTodaysRatings(todaysEvent.id) : [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header 
          title="Beer Rating" 
          actions={[
            {
              label: 'Events',
              icon: null,
              className: 'bg-purple-600 hover:bg-purple-700 text-white',
              onClick: () => setCurrentView('events')
            },
            {
              label: 'Stats',
              icon: <BarChartIcon />,
              className: 'bg-orange-600 hover:bg-orange-700 text-white',
              onClick: () => setCurrentView('statistics')
            },
            {
              label: 'Admin',
              icon: <PlusIcon />,
              className: 'bg-gray-600 hover:bg-gray-700 text-white',
              onClick: () => setShowAdminMenu(true)
            }
          ]}
        />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Name Input */}
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-4">
              <label className="block text-sm font-semibold mb-2 text-white">Dein Name</label>
              <input
                type="text"
                value={raterName}
                onChange={(e) => setRaterName(e.target.value)}
                placeholder="Name eingeben..."
                className="w-full p-3 rounded-xl bg-white bg-opacity-20 border-0 text-white placeholder-white placeholder-opacity-60 text-lg font-semibold"
              />
            </div>

            {todaysEvent ? (
              <>
                {/* Combined Event & Rating Card */}
                <div className="bg-white bg-opacity-15 backdrop-blur rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HuskiesLogo size="w-12 h-12" />
                    <div className="text-2xl">🏒</div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{getEventTitle(todaysEvent)}</h2>
                      <p className="text-white text-opacity-80">
                        {new Date(todaysEvent.date).toLocaleDateString('de-DE', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{eventBeers.length}</div>
                      <div className="text-white text-opacity-70 text-sm">Getränke</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{myRatings.length}</div>
                      <div className="text-white text-opacity-70 text-sm">Deine Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{eventBeers.length - myRatings.length}</div>
                      <div className="text-white text-opacity-70 text-sm">Noch offen</div>
                    </div>
                  </div>

                  {eventBeers.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-white text-opacity-70">Noch keine Getränke für dieses Event</p>
                      <button
                        onClick={() => {
                          setSelectedEvent(todaysEvent);
                          setCurrentView('addBeers');
                        }}
                        className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Getränke hinzufügen
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Divider */}
                      <div className="border-t border-white border-opacity-20 my-6"></div>
                      
                      {/* Rating Section */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-4">🍺 Getränke bewerten</h3>
                        
                        {!raterName.trim() && (
                          <div className="bg-yellow-600 bg-opacity-30 rounded-xl p-4 mb-4">
                            <p className="text-white text-sm">👆 Trage oben deinen Namen ein um zu bewerten</p>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          {eventBeers.map((beer) => {
                            const existingRating = ratings.find(r => 
                              r.eventId === todaysEvent.id && 
                              r.beerId === beer.id && 
                              r.raterName === raterName
                            );
                            const currentRating = existingRating?.rating || 0;
                            
                            return (
                              <div key={beer.id} className={`rounded-xl p-4 transition-all ${
                                currentRating > 0 
                                  ? 'bg-green-600 bg-opacity-30 border-2 border-green-400' 
                                  : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                              }`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-semibold text-white">{beer.name}</h4>
                                    <p className="text-white text-opacity-80 text-sm">{beer.brewery}</p>
                                    <p className="text-white text-opacity-60 text-xs">{beer.style}</p>
                                  </div>
                                  {currentRating > 0 && (
                                    <div className="bg-green-600 px-3 py-1 rounded-full">
                                      <span className="text-white font-bold">✓ {currentRating}★</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-white text-sm">Bewertung:</span>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        disabled={!raterName.trim() || submitLoading}
                                        onClick={() => submitRating(beer.id, star)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all disabled:opacity-50 ${
                                          star <= currentRating
                                            ? 'bg-yellow-400 border-yellow-400 text-yellow-900'
                                            : 'border-white border-opacity-30 text-white hover:border-yellow-400 hover:text-yellow-400'
                                        }`}
                                      >
                                        <span className="font-bold text-lg">{star}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {raterName.trim() && eventBeers.length > 0 && (
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => {
                                setSelectedEvent(todaysEvent);
                                setCurrentView('addBeers');
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                              + Weitere Getränke hinzufügen
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* No Event Today */
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🍺</div>
                <h3 className="text-xl font-bold text-white mb-2">Kein Event heute</h3>
                <p className="text-white text-opacity-70 mb-6">
                  Heute findet kein Event statt. Schau bei 'Events' für kommende Termine oder erstelle ein neues Event.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentView('events')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    📅 Events ansehen
                  </button>
                  {events.length === 0 && (
                <button
                  onClick={() => setCurrentView('createEvent')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Erstes Event erstellen
                </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Admin Menu Modal */}
        {showAdminMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-6">⚙️ Admin Bereich</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowAdminMenu(false);
                    setCurrentView('createEvent');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3"
                >
                  <PlusIcon />
                  Neues Event erstellen
                </button>
                
                <button
                  onClick={() => {
                    setShowAdminMenu(false);
                    setCurrentView('events');
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  📅 Alle Events verwalten
                </button>
                
                <button
                  onClick={() => {
                    setShowAdminMenu(false);
                    setCurrentView('rateBeers');
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  ⭐ Nachträglich bewerten
                </button>
                
                <button
                  onClick={() => setShowAdminMenu(false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Events Management View (Admin)
  if (currentView === 'events') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header 
          title="Event Management" 
          showBack={true}
          actions={[
            {
              label: 'Event',
              icon: <PlusIcon />,
              className: 'bg-blue-600 hover:bg-blue-700 text-white',
              onClick: () => setCurrentView('createEvent')
            }
          ]}
        />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto space-y-4">
            {events.map((event) => {
              const eventBeersList = getEventBeersForEvent(event.id);
              const totalRatings = eventBeersList.reduce((sum, beer) => sum + getRatingsCount(event.id, beer.id), 0);
              
              return (
                <div 
                  key={event.id} 
                  className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 cursor-pointer hover:bg-opacity-20 transition-all"
                  onClick={() => {
                    setSelectedEvent(event);
                    setCurrentView('eventDetails');
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🏒</div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {new Date(event.date).toLocaleDateString('de-DE', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-xs text-white text-opacity-60">
                            {new Date(event.date).getFullYear()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{eventBeersList.length}</div>
                          <div className="text-white text-opacity-70 text-xs">Getränke</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{totalRatings}</div>
                          <div className="text-white text-opacity-70 text-xs">Bewertungen</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {totalRatings > 0 && (
                        <div className="bg-green-600 bg-opacity-30 p-2 rounded-lg">
                          <BarChartIcon />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setCurrentView('addBeers');
                        }}
                        className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm transition-colors text-white font-semibold"
                      >
                        + Getränke
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {events.length === 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">🏒</div>
                <h3 className="text-xl font-bold text-white mb-2">Noch keine Events</h3>
                <p className="text-white text-opacity-70 mb-6">
                  Erstelle das erste Event um loszulegen
                </p>
                <button
                  onClick={() => setCurrentView('createEvent')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Erstes Event erstellen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return <div>Loading...</div>;
}

export default App;