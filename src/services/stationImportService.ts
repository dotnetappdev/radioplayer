import { databaseService } from '../db/database';
import { RadioStation } from '../db/types';
import { fmStreamService, FMStreamStation } from './fmStreamService';

export interface ImportResult {
  totalFetched: number;
  totalImported: number;
  duplicatesSkipped: number;
  errors: string[];
}

class StationImportService {
  /**
   * Import stations from FMStream into the database
   */
  async importFromFMStream(maxStations: number = 50): Promise<ImportResult> {
    const result: ImportResult = {
      totalFetched: 0,
      totalImported: 0,
      duplicatesSkipped: 0,
      errors: []
    };

    try {
      console.log('Starting FMStream import...');
      
      // Get existing stations to check for duplicates
      const existingStations = await databaseService.getAllStations();
      const existingUrls = new Set<string>(existingStations.map((station: RadioStation) => station.streamUrl.toLowerCase()));
      const existingNames = new Set<string>(existingStations.map((station: RadioStation) => station.name.toLowerCase()));
      const existingIds = new Set<number>(existingStations.map((station: RadioStation) => station.id));
      
      // Fetch stations from FMStream
      const fmStreamResponse = await fmStreamService.fetchStations(maxStations);
      result.totalFetched = fmStreamResponse.stations.length;
      
      console.log(`Fetched ${result.totalFetched} stations from FMStream`);
      
      // Process each station
      for (const fmStation of fmStreamResponse.stations) {
        try {
          // Check for duplicates
          if (this.isDuplicate(fmStation, existingUrls, existingNames)) {
            result.duplicatesSkipped++;
            console.log(`Skipping duplicate station: ${fmStation.name}`);
            continue;
          }
          
          // Convert to RadioStation format
          const radioStation = fmStreamService.convertToRadioStation(fmStation, existingIds);
          
          // Create station in database
          await databaseService.createStation({
            name: radioStation.name,
            streamUrl: radioStation.streamUrl,
            logoUrl: radioStation.logoUrl,
            genre: radioStation.genre,
            country: radioStation.country,
            description: radioStation.description,
            streamType: radioStation.streamType,
            isUserAdded: false
          });
          
          // Update sets to prevent duplicates in same import batch
          existingUrls.add(radioStation.streamUrl.toLowerCase());
          existingNames.add(radioStation.name.toLowerCase());
          existingIds.add(radioStation.id);
          
          result.totalImported++;
          console.log(`Imported station: ${radioStation.name}`);
          
        } catch (error) {
          const errorMsg = `Failed to import station ${fmStation.name}: ${error}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
      console.log(`Import completed. Imported: ${result.totalImported}, Skipped: ${result.duplicatesSkipped}, Errors: ${result.errors.length}`);
      
    } catch (error) {
      const errorMsg = `FMStream import failed: ${error}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    }
    
    return result;
  }

  /**
   * Check if a station is a duplicate of existing stations
   */
  private isDuplicate(
    fmStation: FMStreamStation, 
    existingUrls: Set<string>, 
    existingNames: Set<string>
  ): boolean {
    const normalizedUrl = fmStation.url.toLowerCase();
    const normalizedName = fmStation.name.toLowerCase();
    
    // Check for exact URL match
    if (existingUrls.has(normalizedUrl)) {
      return true;
    }
    
    // Check for exact name match
    if (existingNames.has(normalizedName)) {
      return true;
    }
    
    // Check for similar URLs (same domain, different parameters)
    const urlWithoutParams = normalizedUrl.split('?')[0];
    for (const existingUrl of existingUrls) {
      const existingUrlWithoutParams = existingUrl.split('?')[0];
      if (urlWithoutParams === existingUrlWithoutParams) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalStations: number;
    fmStreamStations: number;
    userStations: number;
    builtInStations: number;
  }> {
    try {
      const allStations = await databaseService.getAllStations();
      
      const fmStreamStations = allStations.filter((station: RadioStation) => 
        !station.isUserAdded && 
        (station.streamUrl.includes('fmstream') || station.description?.includes('FMStream'))
      ).length;
      
      const userStations = allStations.filter((station: RadioStation) => station.isUserAdded).length;
      const builtInStations = allStations.length - fmStreamStations - userStations;
      
      return {
        totalStations: allStations.length,
        fmStreamStations,
        userStations,
        builtInStations
      };
    } catch (error) {
      console.error('Failed to get import stats:', error);
      return {
        totalStations: 0,
        fmStreamStations: 0,
        userStations: 0,
        builtInStations: 0
      };
    }
  }

  /**
   * Remove all FMStream stations from database
   */
  async removeFMStreamStations(): Promise<number> {
    try {
      const allStations = await databaseService.getAllStations();
      const fmStreamStations = allStations.filter((station: RadioStation) => 
        !station.isUserAdded && 
        (station.streamUrl.includes('fmstream') || station.description?.includes('FMStream'))
      );
      
      let removedCount = 0;
      for (const station of fmStreamStations) {
        try {
          await databaseService.deleteStation(station.id);
          removedCount++;
        } catch (error) {
          console.error(`Failed to remove FMStream station ${station.name}:`, error);
        }
      }
      
      console.log(`Removed ${removedCount} FMStream stations`);
      return removedCount;
    } catch (error) {
      console.error('Failed to remove FMStream stations:', error);
      return 0;
    }
  }
}

export const stationImportService = new StationImportService();