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

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

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

// Huskies Logo Component
const HuskiesLogo = ({ size = "w-8 h-8" }) => (
  <div className={`${size} bg-white rounded-full flex items-center justify-center`}>
    <div className="text-blue-900 font-bold text-lg">🐺</div>
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
    { id: 'mock-event-1', date: '2024-01-15', created: '2024-01-15T10:00:00Z' }
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

// Mock beer data for search
const mockBeers = [
  { id: 'mock-1', name: 'Augustiner Helles', brewery: 'Augustiner Bräu', style: 'Helles' },
  { id: 'mock-2', name: 'Weihenstephaner Hefeweizen', brewery: 'Weihenstephaner', style: 'Weizen' },
  { id: 'mock-3', name: 'Spaten Oktoberfest', brewery: 'Spaten', style: 'Märzen' },
  { id: 'mock-4', name: 'Rotkäppchen Sekt', brewery: 'Rotkäppchen', style: 'Sekt' },
  { id: 'mock-5', name: 'Löwenbräu Original', brewery: 'Löwenbräu', style: 'Helles' },
  { id: 'mock-6', name: 'Paulaner Weissbier', brewery: 'Paulaner', style: 'Weizen' },
  { id: 'mock-7', name: 'Franziskaner Weissbier', brewery: 'Franziskaner', style: 'Weizen' },
  { id: 'mock-8', name: 'Mumm Sekt', brewery: 'Mumm', style: 'Sekt' }
];

// API functions (real Airtable or mock)
const createApiClient = () => {
  if (USE_MOCK_DATA) {
    console.log('🎭 Using MOCK DATA - Set environment variables for real Airtable integration');
    
    return {
      async getRecords(tableName) {
        console.log(`📡 [MOCK] Fetching ${tableName}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const tableMap = {
          'Events': mockData.events.map(item => ({ id: item.id, fields: { Date: item.date, Created: item.created } })),
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
          const newEvent = { id, date: fields.Date, created };
          mockData.events.push(newEvent);
          return { id, fields: { Date: fields.Date, Created: created } };
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
      }
    };
  }
};

const airtableApi = createApiClient();

function App() {
  const [currentView, setCurrentView] = useState('events');
  const [events, setEvents] = useState([]);
  const [beers, setBeers] = useState([]);
  const [eventBeers, setEventBeers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [raterName, setRaterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

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
        created: record.fields.Created
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

  const searchBeers = (term) => {
    if (!term) return [];
    return mockBeers.filter(beer => 
      beer.name.toLowerCase().includes(term.toLowerCase()) ||
      beer.brewery.toLowerCase().includes(term.toLowerCase())
    );
  };

  const createEvent = async (date) => {
    console.log('🚀 Starting createEvent with date:', date);
    setSubmitLoading(true);
    
    try {
      console.log('📡 Calling API...');
      const result = await airtableApi.createRecord('Events', {
        Date: date
      });
      
      console.log('📥 API result:', result);
      
      if (result && result.id) {
        const newEvent = {
          id: result.id,
          date: result.fields.Date,
          created: result.fields.Created
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

  const addBeerToEvent = async (beer) => {
    if (!selectedEvent) return;
    
    setSubmitLoading(true);
    try {
      let existingBeer = beers.find(b => b.name === beer.name && b.brewery === beer.brewery);
      
      if (!existingBeer) {
        const beerResult = await airtableApi.createRecord('Beers', {
          Name: beer.name,
          Brewery: beer.brewery,
          Style: beer.style,
          API_ID: beer.id
        });
        
        if (beerResult) {
          existingBeer = {
            id: beerResult.id,
            name: beerResult.fields.Name,
            brewery: beerResult.fields.Brewery,
            style: beerResult.fields.Style,
            apiId: beerResult.fields.API_ID
          };
          setBeers([...beers, existingBeer]);
        }
      }

      const alreadyAdded = eventBeers.find(eb => 
        eb.eventId === selectedEvent.id && eb.beerId === existingBeer.id
      );

      if (!alreadyAdded) {
        const eventBeerResult = await airtableApi.createRecord('Event_Beers', {
          Event: [selectedEvent.id],
          Beer: [existingBeer.id]
        });

        if (eventBeerResult) {
          const newEventBeer = {
            id: eventBeerResult.id,
            eventId: selectedEvent.id,
            beerId: existingBeer.id
          };
          setEventBeers([...eventBeers, newEventBeer]);
        }
      }
    } catch (error) {
      console.error('Error adding beer to event:', error);
      alert('Fehler beim Hinzufügen des Getränks');
    } finally {
      setSubmitLoading(false);
    }
  };

  const submitRating = async (beerId, rating) => {
    if (!raterName.trim()) {
      alert('Bitte gib deinen Namen ein!');
      return;
    }

    if (!selectedEvent) return;

    setSubmitLoading(true);
    try {
      const existingRating = ratings.find(r => 
        r.eventId === selectedEvent.id && 
        r.beerId === beerId && 
        r.raterName === raterName
      );

      if (existingRating) {
        alert('Du hast dieses Getränk bereits bewertet!');
      } else {
        const ratingResult = await airtableApi.createRecord('Ratings', {
          Event: [selectedEvent.id],
          Beer: [beerId],
          Rater_Name: raterName,
          Rating: rating
        });

        if (ratingResult) {
          const newRating = {
            id: ratingResult.id,
            eventId: selectedEvent.id,
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
                onClick={() => setCurrentView('events')}
                className="p-2 text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <BackIcon />
              </button>
            )}
            <HuskiesLogo />
            <div>
              <h1 className="text-lg font-bold text-blue-900">{title}</h1>
              <p className="text-sm text-blue-700">Huskies Beer Rating</p>
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
          <HuskiesLogo size="w-16 h-16" />
          <h1 className="text-xl font-bold text-white mt-4 mb-2">Huskies Beer Rating</h1>
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
    const eventId = selectedEvent.id;
    const beerId = selectedBeer.id;
    const beerRatings = getRatingsForBeer(eventId, beerId);
    const avgRating = getAverageRating(eventId, beerId);
    
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
                  {beerRatings.map((rating) => (
                    <div key={rating.id} className="bg-white bg-opacity-10 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{rating.raterName}</span>
                        <StarRating currentRating={rating.rating} readonly={true} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Event Details View
  if (currentView === 'eventDetails') {
    const eventId = selectedEvent.id;
    const eventBeersList = getEventBeersForEvent(eventId);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header 
          title="Event Details" 
          showBack={true}
          actions={[
            {
              label: 'Bewerten',
              icon: <StarIcon filled={true} />,
              className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
              onClick: () => {
                if (eventBeersList.length === 0) {
                  alert('Erst Getränke zum Event hinzufügen!');
                  return;
                }
                setCurrentView('rateBeers');
              }
            }
          ]}
        />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                {new Date(selectedEvent.date).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <p className="text-white text-opacity-80">{eventBeersList.length} Getränke zum Bewerten</p>
            </div>
            
            {eventBeersList.length === 0 ? (
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 text-center">
                <p className="text-white text-opacity-70 mb-4">Noch keine Getränke hinzugefügt</p>
                <button
                  onClick={() => setCurrentView('addBeers')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Getränke hinzufügen
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {eventBeersList.map((beer) => {
                  const avgRating = getAverageRating(eventId, beer.id);
                  const ratingsCount = getRatingsCount(eventId, beer.id);
                  
                  return (
                    <div 
                      key={beer.id} 
                      className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-4 cursor-pointer hover:bg-opacity-20 transition-all"
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
                              <p className="text-white text-opacity-70 text-xs">{ratingsCount} Bewertungen</p>
                            </>
                          ) : (
                            <p className="text-white text-opacity-50 text-sm">Noch nicht bewertet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
      console.log('Creating event with date:', selectedDate);
      await createEvent(selectedDate);
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

  // Add Beers View
  if (currentView === 'addBeers') {
    const searchResults = searchBeers(searchTerm);
    const currentEventBeers = getEventBeersForEvent(selectedEvent?.id || '');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header title="Getränke hinzufügen" showBack={true} />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="relative mb-6">
              <div className="absolute left-3 top-3">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Bier oder Sekt suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 rounded-lg bg-white bg-opacity-90 border-0 text-gray-900 placeholder-gray-500 text-lg"
              />
            </div>
            
            {searchResults.map((beer) => {
              const alreadyAdded = currentEventBeers.some(b => b.name === beer.name && b.brewery === beer.brewery);
              
              return (
                <div key={beer.id} className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{beer.name}</h3>
                      <p className="text-sm text-white text-opacity-80">{beer.brewery}</p>
                      <p className="text-xs text-white text-opacity-60">{beer.style}</p>
                    </div>
                    <button
                      onClick={() => addBeerToEvent(beer)}
                      disabled={alreadyAdded || submitLoading}
                      className={`p-3 rounded-lg transition-colors ${
                        alreadyAdded 
                          ? 'bg-green-600 cursor-default' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } disabled:opacity-50`}
                    >
                      {submitLoading ? <LoadingIcon /> : alreadyAdded ? '✓' : <PlusIcon />}
                    </button>
                  </div>
                </div>
              );
            })}
            
            {currentEventBeers.length > 0 && (
              <div className="mt-6 bg-white bg-opacity-10 backdrop-blur rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-white">Ausgewählte Getränke ({currentEventBeers.length})</h3>
                {currentEventBeers.map((beer) => (
                  <div key={beer.id} className="bg-green-600 bg-opacity-30 rounded-lg p-3 mb-2">
                    <p className="font-medium text-white">{beer.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rate Beers View
  if (currentView === 'rateBeers') {
    const currentEventBeers = getEventBeersForEvent(selectedEvent?.id || '');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <Header title="Getränke bewerten" showBack={true} />
        
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 mb-6">
              <label className="block text-sm font-medium mb-2 text-white">Dein Name</label>
              <input
                type="text"
                value={raterName}
                onChange={(e) => setRaterName(e.target.value)}
                placeholder="Name eingeben..."
                className="w-full p-3 rounded-lg bg-white bg-opacity-90 border-0 text-gray-900 placeholder-gray-500 text-lg"
              />
            </div>
            
            {currentEventBeers.map((beer) => {
              const existingRating = ratings.find(r => 
                r.eventId === selectedEvent?.id && 
                r.beerId === beer.id && 
                r.raterName === raterName
              );
              const currentRating = existingRating?.rating || 0;
              
              return (
                <div key={beer.id} className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 mb-4">
                  <h3 className="font-semibold mb-1 text-white">{beer.name}</h3>
                  <p className="text-sm text-white text-opacity-80 mb-4">{beer.brewery}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">Bewertung:</span>
                    <StarRating
                      beerId={beer.id}
                      currentRating={currentRating}
                      onRate={(rating) => submitRating(beer.id, rating)}
                    />
                  </div>
                  
                  {currentRating > 0 && (
                    <p className="text-green-400 text-sm mt-2">
                      ✓ Bewertet mit {currentRating} Stern{currentRating !== 1 ? 'en' : ''}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main Events View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <Header 
        title="Events" 
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
            const hasRatings = eventBeersList.some(beer => getRatingsCount(event.id, beer.id) > 0);
            
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
                      <CalendarIcon />
                      <h3 className="font-semibold text-white">
                        {new Date(event.date).toLocaleDateString('de-DE', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <p className="text-sm text-white text-opacity-80">
                      {eventBeersList.length} Getränke
                      {hasRatings && ' • Bewertungen vorhanden'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasRatings && (
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
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm transition-colors text-white"
                    >
                      Getränke
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {events.length === 0 && (
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-8 text-center">
              <CalendarIcon />
              <p className="text-white text-opacity-70 mt-4">Noch keine Events erstellt</p>
              <p className="text-white text-opacity-50 text-sm mt-2">
                Erstelle dein erstes Event mit dem + Button
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;