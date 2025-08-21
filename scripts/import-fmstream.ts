#!/usr/bin/env node

/**
 * Script to import stations from FMStream into the radio player database
 * Usage: npm run import-fmstream [maxStations]
 */

import { stationImportService } from '../src/services/stationImportService';
import { databaseService } from '../src/db/database';

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const maxStations = args[0] ? parseInt(args[0], 10) : 50;
    
    console.log('='.repeat(50));
    console.log('🎵 FMStream Station Import Tool');
    console.log('='.repeat(50));
    console.log(`📡 Importing up to ${maxStations} stations from FMStream...`);
    console.log('');
    
    // Initialize database
    console.log('🔧 Initializing database...');
    await databaseService.initialize();
    
    // Get stats before import
    const statsBefore = await stationImportService.getImportStats();
    console.log('📊 Current database stats:');
    console.log(`   Total stations: ${statsBefore.totalStations}`);
    console.log(`   Built-in stations: ${statsBefore.builtInStations}`);
    console.log(`   FMStream stations: ${statsBefore.fmStreamStations}`);
    console.log(`   User stations: ${statsBefore.userStations}`);
    console.log('');
    
    // Perform import
    console.log('⬇️  Starting import process...');
    const importResult = await stationImportService.importFromFMStream(maxStations);
    
    // Show results
    console.log('');
    console.log('✅ Import completed!');
    console.log('📈 Import Results:');
    console.log(`   Total fetched: ${importResult.totalFetched}`);
    console.log(`   Successfully imported: ${importResult.totalImported}`);
    console.log(`   Duplicates skipped: ${importResult.duplicatesSkipped}`);
    console.log(`   Errors: ${importResult.errors.length}`);
    
    if (importResult.errors.length > 0) {
      console.log('');
      console.log('❌ Errors encountered:');
      importResult.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // Get stats after import
    const statsAfter = await stationImportService.getImportStats();
    console.log('');
    console.log('📊 Updated database stats:');
    console.log(`   Total stations: ${statsAfter.totalStations} (+${statsAfter.totalStations - statsBefore.totalStations})`);
    console.log(`   Built-in stations: ${statsAfter.builtInStations}`);
    console.log(`   FMStream stations: ${statsAfter.fmStreamStations} (+${statsAfter.fmStreamStations - statsBefore.fmStreamStations})`);
    console.log(`   User stations: ${statsAfter.userStations}`);
    
    console.log('');
    console.log('🎉 Import process completed successfully!');
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Import interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Import terminated');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main();
}