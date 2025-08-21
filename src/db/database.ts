import { Platform } from 'react-native';

// Conditionally import database services
let databaseService: any;

try {
  if (Platform.OS === 'web') {
    // Use web database service for web
    const webDb = require('./webDatabase');
    databaseService = webDb.webDatabaseService;
  } else {
    // Use native database service for native platforms
    const nativeDb = require('./nativeDatabase');
    databaseService = nativeDb.databaseService;
  }
} catch (error) {
  console.warn('Database service initialization failed, falling back to web service:', error);
  // Fall back to web database service if native module fails
  const webDb = require('./webDatabase');
  databaseService = webDb.webDatabaseService;
}

export { databaseService };