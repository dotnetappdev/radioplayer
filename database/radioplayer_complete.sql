-- =====================================================
-- Radio Player Database - Complete Setup
-- =====================================================
-- This file contains the complete database schema and initial data
-- for the radio player application including UK, Northern Ireland,
-- international, and worship radio stations.

-- =====================================================
-- SCHEMA CREATION
-- =====================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    frequency TEXT,
    stream_url TEXT NOT NULL,
    website_url TEXT,
    country TEXT NOT NULL,
    region TEXT,
    category_id INTEGER,
    logo_url TEXT,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stations_country ON stations(country);
CREATE INDEX IF NOT EXISTS idx_stations_category ON stations(category_id);
CREATE INDEX IF NOT EXISTS idx_stations_active ON stations(is_active);

-- =====================================================
-- DATA INSERTION
-- =====================================================

-- Insert radio station categories
INSERT INTO categories (name, description) VALUES 
('News', 'News and current affairs'),
('Talk', 'Talk radio and discussion shows'),
('Sport', 'Sports coverage and commentary'),
('Classical', 'Classical music and opera'),
('Rock', 'Rock music and guitar-based genres'),
('Pop', 'Popular music and mainstream hits'),
('Dance', 'Electronic dance music and club sounds'),
('Jazz', 'Jazz, blues and swing music'),
('Country', 'Country and folk music'),
('Alternative', 'Alternative rock and indie music'),
('Adult Contemporary', 'Easy listening and adult-oriented music'),
('Top 40/Chart', 'Current chart hits and trending music'),
('Local', 'Local community and regional radio'),
('Worship', 'Christian and religious programming'),
('International', 'World music and international content'),
('BBC Services', 'BBC radio network stations');

-- =====================================================
-- UK RADIO STATIONS
-- =====================================================

-- BBC Stations
INSERT INTO stations (name, frequency, stream_url, website_url, country, region, category_id, description) VALUES 
('BBC Radio 1', '97-99 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one', 'https://www.bbc.co.uk/radio1', 'United Kingdom', 'National', 16, 'The UKs number one hit music station'),
('BBC Radio 2', '88-91 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two', 'https://www.bbc.co.uk/radio2', 'United Kingdom', 'National', 16, 'The UKs most listened-to radio station'),
('BBC Radio 3', '90-93 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three', 'https://www.bbc.co.uk/radio3', 'United Kingdom', 'National', 4, 'Classical music, jazz, world music and arts'),
('BBC Radio 4', '92-95 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm', 'https://www.bbc.co.uk/radio4', 'United Kingdom', 'National', 2, 'News, current affairs, arts and drama'),
('BBC Radio 5 Live', '693/909 MW', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live', 'https://www.bbc.co.uk/5live', 'United Kingdom', 'National', 3, 'Live news and sports coverage'),
('BBC Radio 6 Music', 'DAB/Online', 'https://stream.live.vc.bbcmedia.co.uk/bbc_6music', 'https://www.bbc.co.uk/6music', 'United Kingdom', 'National', 10, 'Alternative music and live sessions'),

-- Commercial UK Stations
('Heart FM', '106.2 FM', 'https://media-ice.musicradio.com/HeartLondonMP3', 'https://www.heart.co.uk', 'United Kingdom', 'London', 11, 'Feel good music for adults'),
('Capital FM', '95.8 FM', 'https://media-ice.musicradio.com/CapitalMP3', 'https://www.capitalfm.com', 'United Kingdom', 'London', 12, 'Today\'s hit music and chart toppers'),
('LBC', '97.3 FM', 'https://media-ice.musicradio.com/LBCLondonMP3', 'https://www.lbc.co.uk', 'United Kingdom', 'London', 2, 'Leading talk radio station'),
('Classic FM', '100-102 FM', 'https://media-ice.musicradio.com/ClassicFMMP3', 'https://www.classicfm.com', 'United Kingdom', 'National', 4, 'Classical music station'),
('Absolute Radio', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/absoluteradio.mp3', 'https://www.absoluteradio.co.uk', 'United Kingdom', 'National', 5, 'Rock and guitar music'),
('Kiss FM', '100 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/kissfmuk.mp3', 'https://www.kissfm.co.uk', 'United Kingdom', 'National', 7, 'Dance and electronic music');

-- =====================================================
-- NORTHERN IRELAND RADIO STATIONS
-- =====================================================

INSERT INTO stations (name, frequency, stream_url, website_url, country, region, category_id, description) VALUES 
('BBC Radio Ulster', '92.4-95.4 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster', 'https://www.bbc.co.uk/radioulster', 'United Kingdom', 'Northern Ireland', 13, 'BBC local radio for Northern Ireland'),
('BBC Radio Foyle', '93.1 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_foyle', 'https://www.bbc.co.uk/radiofoyle', 'United Kingdom', 'Northern Ireland', 13, 'BBC local radio for Derry/Londonderry area'),
('Cool FM', '97.4 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/coolfm.mp3', 'https://www.coolfm.co.uk', 'United Kingdom', 'Northern Ireland', 12, 'Northern Ireland\'s biggest hit music station'),
('U105', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/u105.mp3', 'https://www.u105.com', 'United Kingdom', 'Northern Ireland', 11, 'Best music and chat for Belfast');

-- =====================================================
-- INTERNATIONAL RADIO STATIONS
-- =====================================================

INSERT INTO stations (name, stream_url, website_url, country, region, category_id, description) VALUES 
('NPR', 'https://npr-ice.streamguys1.com/live.mp3', 'https://www.npr.org', 'United States', 'National', 1, 'National Public Radio'),
('BBC World Service', 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', 'https://www.bbc.co.uk/worldservice', 'United Kingdom', 'International', 1, 'BBC international news service'),
('France Inter', 'https://icecast.radiofrance.fr/franceinter-midfi.mp3', 'https://www.radiofrance.fr/franceinter', 'France', 'National', 15, 'French national radio'),
('RTE Radio 1', 'https://icecast2.rte.ie/ie/radio1', 'https://www.rte.ie/radio1', 'Ireland', 'National', 15, 'Irish national radio'),
('CBC Radio One', 'https://cbc_r1_tor.leanstream.co/cbc_r1_tor', 'https://www.cbc.ca/radio/radio1', 'Canada', 'National', 1, 'Canadian Broadcasting Corporation'),
('ABC Radio National', 'https://abcradio.ic.llnwd.net/stream/abcradio_mp3_radio_national', 'https://www.abc.net.au/radionational', 'Australia', 'National', 2, 'Australian Broadcasting Corporation');

-- =====================================================
-- WORSHIP/CHRISTIAN RADIO STATIONS
-- =====================================================

INSERT INTO stations (name, stream_url, website_url, country, region, category_id, description) VALUES 
('Premier Christian Radio', 'https://icy-e-bab-04-gos.sharp-stream.com/premier.mp3', 'https://www.premier.org.uk', 'United Kingdom', 'National', 14, 'Christian talk and music'),
('UCB UK', 'https://icy-e-bab-04-gos.sharp-stream.com/ucbuk.mp3', 'https://www.ucb.co.uk', 'United Kingdom', 'National', 14, 'Uplifting Christian broadcasting'),
('Cross Rhythms', 'https://icy-e-bab-04-gos.sharp-stream.com/crossrhythms.mp3', 'https://www.crossrhythms.co.uk', 'United Kingdom', 'National', 14, 'Christian music and talk'),
('Revelation TV Radio', 'https://icy-e-bab-04-gos.sharp-stream.com/revelationtv.mp3', 'https://www.revelationtv.com', 'United Kingdom', 'National', 14, 'Christian television and radio'),
('K-LOVE', 'https://icy-e-bab-04-gos.sharp-stream.com/klove.mp3', 'https://www.klove.com', 'United States', 'National', 14, 'Contemporary Christian music'),
('Air1', 'https://icy-e-bab-04-gos.sharp-stream.com/air1.mp3', 'https://www.air1.com', 'United States', 'National', 14, 'Positive hits radio'),
('Hope FM', 'https://streaming.hopefm.com/hopefm', 'https://www.hopefm.com', 'Australia', 'National', 14, 'Christian radio Australia'),
('Life FM', 'https://icy-e-bab-04-gos.sharp-stream.com/lifefm.mp3', 'https://www.lifefm.co.nz', 'New Zealand', 'National', 14, 'Christian radio New Zealand');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Use these queries to verify the data was inserted correctly:

-- SELECT COUNT(*) as total_stations FROM stations;
-- SELECT COUNT(*) as total_categories FROM categories;
-- SELECT country, COUNT(*) as station_count FROM stations GROUP BY country;
-- SELECT c.name as category, COUNT(s.id) as station_count 
-- FROM categories c LEFT JOIN stations s ON c.id = s.category_id 
-- GROUP BY c.name;