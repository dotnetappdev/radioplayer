# FMStream Integration

This feature allows you to import radio stations from FMStream into your radio player database.

## Features

### 🎵 Station Import
- Fetch stations from FMStream API
- Convert FMStream station data to RadioStation format
- Automatic deduplication to prevent duplicate stations
- Support for multiple genres (pop, rock, jazz, electronic, news, classical, etc.)
- Automatic stream type detection (HTTP, HTTPS, HLS, etc.)

### 🔄 Deduplication
- Prevents duplicate stations by checking:
  - Stream URL (exact match and similar URLs)
  - Station name (case-insensitive)
- Skips existing stations to maintain database integrity

### 🎯 Genre Normalization
- Maps FMStream genres to app's supported genres:
  - Pop, Rock, News, Classical, Jazz, Electronic
  - Hip-Hop, R&B, Alternative, Folk, Dance, Country
- Defaults to 'pop' for unknown genres

## Usage

### Via UI (Recommended)
1. Open the app and go to the "Manage" tab
2. Tap the "Import" button (green button with download icon)
3. Confirm the import in the dialog
4. Wait for the import to complete
5. Check the results in the completion dialog

### Via Command Line (Advanced)
```bash
npm run import-fmstream [maxStations]
```

Example:
```bash
npm run import-fmstream 20  # Import up to 20 stations
```

## Technical Details

### Services

#### FMStreamService (`src/services/fmStreamService.ts`)
- Handles API communication with FMStream
- Provides mock data when API is unavailable
- Converts FMStream data to RadioStation format
- Determines stream types and normalizes genres

#### StationImportService (`src/services/stationImportService.ts`)
- Manages the import process
- Handles deduplication logic
- Provides import statistics
- Integrates with the database service

### Mock Data
When the actual FMStream API is not available, the service provides realistic mock data with 8 diverse stations:

1. **FMStream Pop Radio** (US) - Popular music hits
2. **FMStream Rock Station** (UK) - Classic and modern rock
3. **FMStream Jazz Lounge** (US) - Smooth jazz and blues
4. **FMStream Electronic** (Germany) - Electronic dance music
5. **FMStream News Network** (Canada) - Global news
6. **FMStream Classical** (Austria) - Classical masterpieces
7. **FMStream Hip-Hop** (US) - Latest hip-hop and rap
8. **FMStream Country** (US) - Country music classics

### Stream Types Support
- **HTTP/HTTPS**: Standard streaming protocols
- **HLS (.m3u8)**: HTTP Live Streaming
- **ICY**: Icecast/Shoutcast streams
- **DASH**: Dynamic Adaptive Streaming (future support)

### Database Integration
- Uses existing `createStation` method from DatabaseService
- Stations are marked as `isUserAdded: false` (external stations)
- Integrates seamlessly with existing station management
- Supports both native SQLite and web storage

## Import Results

The import process provides detailed feedback:
- **Total Fetched**: Number of stations received from FMStream
- **Successfully Imported**: Number of new stations added
- **Duplicates Skipped**: Number of stations that already exist
- **Errors**: Any issues encountered during import

## Future Enhancements

1. **Real API Integration**: Connect to actual FMStream API when available
2. **Batch Management**: Import/remove FMStream stations in batches
3. **Selective Import**: Choose specific genres or countries
4. **Auto-Updates**: Periodically refresh FMStream stations
5. **Quality Filtering**: Import only high-quality streams

## Troubleshooting

### Import Button Not Working
- Ensure you have network connectivity
- Check that the database is properly initialized
- Try refreshing the manage stations screen

### No Stations Imported
- All stations might be duplicates of existing ones
- Check the import results dialog for details
- Try with a smaller batch size first

### App Performance Issues
- Import large batches (>50 stations) during off-peak usage
- Consider removing unused stations periodically
- Monitor database size in app settings