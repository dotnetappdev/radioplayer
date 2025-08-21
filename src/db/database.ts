import { Platform } from 'react-native';
import { RadioStation, Genre } from './types';

// Conditionally import database services
let databaseService: any;

if (Platform.OS === 'web') {
  // Use web database service for web
  const webDb = require('./webDatabase');
  databaseService = webDb.webDatabaseService;
} else {
  // Use native database service for native platforms
  const nativeDb = require('./nativeDatabase');
  databaseService = nativeDb.databaseService;
}

export { databaseService };