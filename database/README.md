# Radio Player Database

This directory contains the SQLite database implementation for the Radio Player app.

## Files

- **`radioplayer_complete.sql`** - Complete SQL file with schema and all radio station data
- **`schema.sql`** - Database schema only (tables, indexes)
- **`stations_data.sql`** - Radio station data only (inserts)
- **`DatabaseService.ts`** - TypeScript service for database operations

## Database Schema

### Categories Table
- `id` - Primary key
- `name` - Category name (unique)
- `description` - Category description
- `created_at` - Timestamp

### Stations Table
- `id` - Primary key
- `name` - Station name
- `frequency` - FM/AM frequency (optional)
- `stream_url` - Audio stream URL
- `website_url` - Station website (optional)
- `country` - Country name
- `region` - Region/state/province (optional)
- `category_id` - Foreign key to categories
- `logo_url` - Station logo URL (optional)
- `description` - Station description (optional)
- `is_active` - Whether station is active (1/0)
- `created_at` - Timestamp

## Radio Stations Included

### UK Stations
- BBC Radio 1, 2, 3, 4, 5 Live, 6 Music
- Heart FM, Capital FM, LBC, Classic FM
- Absolute Radio, Kiss FM

### Northern Ireland Stations
- BBC Radio Ulster, BBC Radio Foyle
- Cool FM, U105

### International Stations
- NPR (US), BBC World Service
- France Inter (France), RTE Radio 1 (Ireland)
- CBC Radio One (Canada), ABC Radio National (Australia)

### Worship/Christian Stations
- Premier Christian Radio, UCB UK, Cross Rhythms (UK)
- K-LOVE, Air1 (US)
- Hope FM (Australia), Life FM (New Zealand)

## Usage

The `DatabaseService.ts` provides methods to:
- Initialize the database with schema and data
- Get all stations or filter by country/category
- Search stations by name or description
- Get categories

## Installation

The database is automatically initialized when the app starts and the `RadioStationList` component is loaded.

## Stream URLs

The stream URLs provided are example URLs. In a production app, you would need to verify these URLs are current and working, as radio stations may change their streaming endpoints.