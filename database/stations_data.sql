-- Insert radio station categories
INSERT INTO categories (name, description) VALUES 
('General', 'General music and talk radio stations'),
('News', 'News and current affairs'),
('Music', 'Music-focused radio stations'),
('Talk', 'Talk radio and discussion shows'),
('Sport', 'Sports coverage and commentary'),
('Classical', 'Classical music stations'),
('Rock', 'Rock and alternative music'),
('Pop', 'Pop music stations'),
('Jazz', 'Jazz and blues music'),
('Electronic', 'Electronic and dance music'),
('Country', 'Country music stations'),
('Worship', 'Christian and religious programming'),
('Community', 'Local community radio'),
('International', 'World music and international content'),
('BBC', 'BBC radio services');

-- Insert UK radio stations
INSERT INTO stations (name, frequency, stream_url, website_url, country, region, category_id, description) VALUES 
-- BBC Stations
('BBC Radio 1', '97-99 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one', 'https://www.bbc.co.uk/radio1', 'United Kingdom', 'National', 15, 'The UKs number one hit music station'),
('BBC Radio 2', '88-91 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two', 'https://www.bbc.co.uk/radio2', 'United Kingdom', 'National', 15, 'The UKs most listened-to radio station'),
('BBC Radio 3', '90-93 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three', 'https://www.bbc.co.uk/radio3', 'United Kingdom', 'National', 6, 'Classical music, jazz, world music and arts'),
('BBC Radio 4', '92-95 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm', 'https://www.bbc.co.uk/radio4', 'United Kingdom', 'National', 4, 'News, current affairs, arts and drama'),
('BBC Radio 5 Live', '693/909 MW', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live', 'https://www.bbc.co.uk/5live', 'United Kingdom', 'National', 5, 'Live news and sports coverage'),
('BBC Radio 6 Music', 'DAB/Online', 'https://stream.live.vc.bbcmedia.co.uk/bbc_6music', 'https://www.bbc.co.uk/6music', 'United Kingdom', 'National', 7, 'Alternative music and live sessions'),

-- Commercial UK Stations
('Heart FM', '106.2 FM', 'https://media-ice.musicradio.com/HeartLondonMP3', 'https://www.heart.co.uk', 'United Kingdom', 'London', 8, 'Feel good music'),
('Capital FM', '95.8 FM', 'https://media-ice.musicradio.com/CapitalMP3', 'https://www.capitalfm.com', 'United Kingdom', 'London', 8, 'Hit music station'),
('LBC', '97.3 FM', 'https://media-ice.musicradio.com/LBCLondonMP3', 'https://www.lbc.co.uk', 'United Kingdom', 'London', 4, 'Leading talk radio station'),
('Classic FM', '100-102 FM', 'https://media-ice.musicradio.com/ClassicFMMP3', 'https://www.classicfm.com', 'United Kingdom', 'National', 6, 'Classical music station'),
('Absolute Radio', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/absoluteradio.mp3', 'https://www.absoluteradio.co.uk', 'United Kingdom', 'National', 7, 'Rock and alternative music'),
('Kiss FM', '100 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/kissfmuk.mp3', 'https://www.kissfm.co.uk', 'United Kingdom', 'National', 10, 'Dance and electronic music'),

-- Northern Ireland Stations
('BBC Radio Ulster', '92.4-95.4 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster', 'https://www.bbc.co.uk/radioulster', 'United Kingdom', 'Northern Ireland', 15, 'BBC local radio for Northern Ireland'),
('BBC Radio Foyle', '93.1 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_foyle', 'https://www.bbc.co.uk/radiofoyle', 'United Kingdom', 'Northern Ireland', 15, 'BBC local radio for Derry/Londonderry area'),
('Cool FM', '97.4 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/coolfm.mp3', 'https://www.coolfm.co.uk', 'United Kingdom', 'Northern Ireland', 8, 'Northern Irelands biggest hit music station'),
('U105', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/u105.mp3', 'https://www.u105.com', 'United Kingdom', 'Northern Ireland', 1, 'Best music and chat for Belfast');

-- International Stations
INSERT INTO stations (name, stream_url, website_url, country, region, category_id, description) VALUES 
('NPR', 'https://npr-ice.streamguys1.com/live.mp3', 'https://www.npr.org', 'United States', 'National', 2, 'National Public Radio'),
('BBC World Service', 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', 'https://www.bbc.co.uk/worldservice', 'United Kingdom', 'International', 2, 'BBC international news service'),
('France Inter', 'https://icecast.radiofrance.fr/franceinter-midfi.mp3', 'https://www.radiofrance.fr/franceinter', 'France', 'National', 1, 'French national radio'),
('RTE Radio 1', 'https://icecast2.rte.ie/ie/radio1', 'https://www.rte.ie/radio1', 'Ireland', 'National', 1, 'Irish national radio'),
('CBC Radio One', 'https://cbc_r1_tor.leanstream.co/cbc_r1_tor', 'https://www.cbc.ca/radio/radio1', 'Canada', 'National', 2, 'Canadian Broadcasting Corporation'),
('ABC Radio National', 'https://abcradio.ic.llnwd.net/stream/abcradio_mp3_radio_national', 'https://www.abc.net.au/radionational', 'Australia', 'National', 4, 'Australian Broadcasting Corporation');

-- Worship/Christian Stations
INSERT INTO stations (name, stream_url, website_url, country, region, category_id, description) VALUES 
('Premier Christian Radio', 'https://icy-e-bab-04-gos.sharp-stream.com/premier.mp3', 'https://www.premier.org.uk', 'United Kingdom', 'National', 12, 'Christian talk and music'),
('UCB UK', 'https://icy-e-bab-04-gos.sharp-stream.com/ucbuk.mp3', 'https://www.ucb.co.uk', 'United Kingdom', 'National', 12, 'Uplifting Christian broadcasting'),
('Cross Rhythms', 'https://icy-e-bab-04-gos.sharp-stream.com/crossrhythms.mp3', 'https://www.crossrhythms.co.uk', 'United Kingdom', 'National', 12, 'Christian music and talk'),
('Revelation TV Radio', 'https://icy-e-bab-04-gos.sharp-stream.com/revelationtv.mp3', 'https://www.revelationtv.com', 'United Kingdom', 'National', 12, 'Christian television and radio'),
('K-LOVE', 'https://icy-e-bab-04-gos.sharp-stream.com/klove.mp3', 'https://www.klove.com', 'United States', 'National', 12, 'Contemporary Christian music'),
('Air1', 'https://icy-e-bab-04-gos.sharp-stream.com/air1.mp3', 'https://www.air1.com', 'United States', 'National', 12, 'Positive hits radio'),
('Hope FM', 'https://streaming.hopefm.com/hopefm', 'https://www.hopefm.com', 'Australia', 'National', 12, 'Christian radio Australia'),
('Life FM', 'https://icy-e-bab-04-gos.sharp-stream.com/lifefm.mp3', 'https://www.lifefm.co.nz', 'New Zealand', 'National', 12, 'Christian radio New Zealand');