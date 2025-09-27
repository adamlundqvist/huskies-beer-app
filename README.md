# Huskies Beer Rating App

A mobile-first web application for the Huskies ice hockey team to rate beers and sekt during events.

## Features

- Create events with dates
- Add beers/sekt to events
- Rate drinks with star system
- View average ratings and individual ratings
- Mobile-optimized responsive design
- Huskies team branding

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Airtable credentials
4. Start development server: `npm start`

## Deployment

### Netlify
1. Push to GitHub
2. Connect to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Environment Variables

- `REACT_APP_AIRTABLE_BASE_ID`: Your Airtable base ID
- `REACT_APP_AIRTABLE_PAT`: Your Airtable Personal Access Token

If these are not set, the app will run in demo mode with mock data.