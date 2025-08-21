import * as SQLite from 'expo-sqlite';

export interface RadioStation {
  id: number;
  name: string;
  frequency?: string;
  stream_url: string;
  website_url?: string;
  country: string;
  region?: string;
  category_id?: number;
  logo_url?: string;
  description?: string;
  is_active: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface StationWithCategory extends RadioStation {
  category_name?: string;
}

export interface PodcastShow {
  id: number;
  title: string;
  description?: string;
  author?: string;
  feed_url: string;
  website_url?: string;
  image_url?: string;
  category_id?: number;
  language?: string;
  is_active: number;
  created_at: string;
}

export interface PodcastEpisode {
  id: number;
  show_id: number;
  title: string;
  description?: string;
  audio_url: string;
  duration?: number;
  published_at: string;
  episode_number?: number;
  season_number?: number;
  file_size?: number;
  is_downloaded: number;
  created_at: string;
}

export interface ShowWithCategory extends PodcastShow {
  category_name?: string;
  latest_episode?: string;
  episode_count?: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('radioplayer.db');
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create categories table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create stations table
    await this.db.execAsync(`
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
    `);

    // Create podcast shows table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS podcast_shows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        author TEXT,
        feed_url TEXT NOT NULL UNIQUE,
        website_url TEXT,
        image_url TEXT,
        category_id INTEGER,
        language TEXT DEFAULT 'en',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
    `);

    // Create podcast episodes table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS podcast_episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        show_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        audio_url TEXT NOT NULL,
        duration INTEGER,
        published_at DATETIME,
        episode_number INTEGER,
        season_number INTEGER,
        file_size INTEGER,
        is_downloaded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (show_id) REFERENCES podcast_shows (id)
      );
    `);

    // Create indexes
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_stations_country ON stations(country);
      CREATE INDEX IF NOT EXISTS idx_stations_category ON stations(category_id);
      CREATE INDEX IF NOT EXISTS idx_stations_active ON stations(is_active);
      CREATE INDEX IF NOT EXISTS idx_podcast_shows_active ON podcast_shows(is_active);
      CREATE INDEX IF NOT EXISTS idx_podcast_episodes_show ON podcast_episodes(show_id);
      CREATE INDEX IF NOT EXISTS idx_podcast_episodes_published ON podcast_episodes(published_at);
    `);
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if data already exists
    const existingCategories = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    if ((existingCategories as any)?.count > 0) {
      return; // Data already seeded
    }

    // Insert categories
    const categories = [
      ['News', 'News and current affairs'],
      ['Talk', 'Talk radio and discussion shows'],
      ['Sport', 'Sports coverage and commentary'],
      ['Classical', 'Classical music and opera'],
      ['Rock', 'Rock music and guitar-based genres'],
      ['Pop', 'Popular music and mainstream hits'],
      ['Dance', 'Electronic dance music and club sounds'],
      ['Jazz', 'Jazz, blues and swing music'],
      ['Country', 'Country and folk music'],
      ['Alternative', 'Alternative rock and indie music'],
      ['Adult Contemporary', 'Easy listening and adult-oriented music'],
      ['Top 40/Chart', 'Current chart hits and trending music'],
      ['Local', 'Local community and regional radio'],
      ['Worship', 'Christian and religious programming'],
      ['International', 'World music and international content'],
      ['BBC Services', 'BBC radio network stations'],
      ['Technology', 'Technology and computing podcasts'],
      ['Science Fiction', 'Science fiction and fantasy podcasts'],
      ['Business', 'Business and entrepreneurship podcasts'],
      ['Comedy', 'Comedy and humor podcasts'],
      ['Education', 'Educational and learning podcasts'],
      ['True Crime', 'True crime and mystery podcasts']
    ];

    for (const [name, description] of categories) {
      await this.db.runAsync(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description]
      );
    }

    // Insert stations data
    const stations = [
      // BBC Stations
      ['BBC Radio 1', '97-99 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one', 'https://www.bbc.co.uk/radio1', 'United Kingdom', 'National', 16, 'The UKs number one hit music station'],
      ['BBC Radio 2', '88-91 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two', 'https://www.bbc.co.uk/radio2', 'United Kingdom', 'National', 16, 'The UKs most listened-to radio station'],
      ['BBC Radio 3', '90-93 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three', 'https://www.bbc.co.uk/radio3', 'United Kingdom', 'National', 4, 'Classical music, jazz, world music and arts'],
      ['BBC Radio 4', '92-95 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm', 'https://www.bbc.co.uk/radio4', 'United Kingdom', 'National', 2, 'News, current affairs, arts and drama'],
      ['BBC Radio 5 Live', '693/909 MW', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live', 'https://www.bbc.co.uk/5live', 'United Kingdom', 'National', 3, 'Live news and sports coverage'],
      ['BBC Radio 6 Music', 'DAB/Online', 'https://stream.live.vc.bbcmedia.co.uk/bbc_6music', 'https://www.bbc.co.uk/6music', 'United Kingdom', 'National', 10, 'Alternative music and live sessions'],
      
      // Commercial UK Stations
      ['Heart FM', '106.2 FM', 'https://media-ice.musicradio.com/HeartLondonMP3', 'https://www.heart.co.uk', 'United Kingdom', 'London', 11, 'Feel good music for adults'],
      ['Capital FM', '95.8 FM', 'https://media-ice.musicradio.com/CapitalMP3', 'https://www.capitalfm.com', 'United Kingdom', 'London', 12, 'Today\'s hit music and chart toppers'],
      ['LBC', '97.3 FM', 'https://media-ice.musicradio.com/LBCLondonMP3', 'https://www.lbc.co.uk', 'United Kingdom', 'London', 2, 'Leading talk radio station'],
      ['Classic FM', '100-102 FM', 'https://media-ice.musicradio.com/ClassicFMMP3', 'https://www.classicfm.com', 'United Kingdom', 'National', 4, 'Classical music station'],
      ['Absolute Radio', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/absoluteradio.mp3', 'https://www.absoluteradio.co.uk', 'United Kingdom', 'National', 5, 'Rock and guitar music'],
      ['Kiss FM', '100 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/kissfmuk.mp3', 'https://www.kissfm.co.uk', 'United Kingdom', 'National', 7, 'Dance and electronic music'],
      ['Smooth Radio', '105.7 FM', 'https://media-ice.musicradio.com/SmoothLondonMP3', 'https://www.smoothradio.com', 'United Kingdom', 'National', 11, 'Relaxing songs and great music'],
      ['Magic FM', '105.4 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/magicfm.mp3', 'https://www.magic.co.uk', 'United Kingdom', 'National', 6, 'The greatest songs of all time'],
      ['Talksport', '1089/1053 AM', 'https://radio.talksport.com/stream', 'https://talksport.com', 'United Kingdom', 'National', 3, 'Sports talk and live coverage'],
      ['Virgin Radio', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/virginradiouk.mp3', 'https://www.virginradio.co.uk', 'United Kingdom', 'National', 5, 'Rock and alternative music'],
      
      // Northern Ireland Stations
      ['BBC Radio Ulster', '92.4-95.4 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster', 'https://www.bbc.co.uk/radioulster', 'United Kingdom', 'Northern Ireland', 13, 'BBC local radio for Northern Ireland'],
      ['BBC Radio Foyle', '93.1 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_foyle', 'https://www.bbc.co.uk/radiofoyle', 'United Kingdom', 'Northern Ireland', 13, 'BBC local radio for Derry/Londonderry area'],
      ['Cool FM', '97.4 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/coolfm.mp3', 'https://www.coolfm.co.uk', 'United Kingdom', 'Northern Ireland', 12, 'Northern Ireland\'s biggest hit music station'],
      ['U105', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/u105.mp3', 'https://www.u105.com', 'United Kingdom', 'Northern Ireland', 11, 'Best music and chat for Belfast'],
      ['Downtown Radio', '96.4 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/downtown.mp3', 'https://www.downtown.co.uk', 'United Kingdom', 'Northern Ireland', 6, 'Music and entertainment for Northern Ireland'],
      
      // International Stations - US
      ['NPR', null, 'https://npr-ice.streamguys1.com/live.mp3', 'https://www.npr.org', 'United States', 'National', 1, 'National Public Radio'],
      ['KROQ', '106.7 FM', 'https://playerservices.streamtheworld.com/api/livestream-redirect/KROQFM.mp3', 'https://kroq.radio.com', 'United States', 'Los Angeles', 10, 'World famous rock station'],
      ['KCRW', '89.9 FM', 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air', 'https://www.kcrw.com', 'United States', 'Los Angeles', 10, 'Eclectic music and NPR news'],
      ['WNYC', '93.9 FM', 'https://fm939.wnyc.org/wnycfm', 'https://www.wnyc.org', 'United States', 'New York', 1, 'New York public radio'],
      ['SiriusXM Hits 1', null, 'https://www.siriusxm.com/hits1', 'https://www.siriusxm.com', 'United States', 'Satellite', 12, 'Today\'s hits and trending music'],
      
      // International Stations - Europe
      ['BBC World Service', null, 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', 'https://www.bbc.co.uk/worldservice', 'United Kingdom', 'International', 1, 'BBC international news service'],
      ['France Inter', null, 'https://icecast.radiofrance.fr/franceinter-midfi.mp3', 'https://www.radiofrance.fr/franceinter', 'France', 'National', 15, 'French national radio'],
      ['Radio 1 (Germany)', null, 'https://wdr-1live-live.icecastssl.wdr.de/wdr/1live/live/mp3/128/stream.mp3', 'https://www1.wdr.de/radio/1live', 'Germany', 'National', 6, 'German youth radio'],
      ['Radio Deejay', null, 'https://deejay-ice.stream.radioitalia.it/radiodeejay', 'https://www.deejay.it', 'Italy', 'National', 6, 'Italian music and entertainment'],
      ['Absolute Radio 80s', null, 'https://icy-e-bab-04-gos.sharp-stream.com/absoluteradio80s.mp3', 'https://www.absoluteradio.co.uk', 'United Kingdom', 'Digital', 5, '80s rock and pop classics'],
      
      // International Stations - Other Regions
      ['RTE Radio 1', null, 'https://icecast2.rte.ie/ie/radio1', 'https://www.rte.ie/radio1', 'Ireland', 'National', 15, 'Irish national radio'],
      ['CBC Radio One', null, 'https://cbc_r1_tor.leanstream.co/cbc_r1_tor', 'https://www.cbc.ca/radio/radio1', 'Canada', 'National', 1, 'Canadian Broadcasting Corporation'],
      ['ABC Radio National', null, 'https://abcradio.ic.llnwd.net/stream/abcradio_mp3_radio_national', 'https://www.abc.net.au/radionational', 'Australia', 'National', 2, 'Australian Broadcasting Corporation'],
      ['Triple J', null, 'https://abcradio.ic.llnwd.net/stream/abcradio_mp3_triple_j', 'https://www.abc.net.au/triplej', 'Australia', 'National', 10, 'Australian youth music and culture'],
      ['Radio New Zealand', null, 'https://radionz-ice.streamguys.com/national', 'https://www.rnz.co.nz', 'New Zealand', 'National', 1, 'New Zealand public radio'],
      
      // Worship/Christian Stations
      ['Premier Christian Radio', null, 'https://icy-e-bab-04-gos.sharp-stream.com/premier.mp3', 'https://www.premier.org.uk', 'United Kingdom', 'National', 14, 'Christian talk and music'],
      ['UCB UK', null, 'https://icy-e-bab-04-gos.sharp-stream.com/ucbuk.mp3', 'https://www.ucb.co.uk', 'United Kingdom', 'National', 14, 'Uplifting Christian broadcasting'],
      ['Cross Rhythms', null, 'https://icy-e-bab-04-gos.sharp-stream.com/crossrhythms.mp3', 'https://www.crossrhythms.co.uk', 'United Kingdom', 'National', 14, 'Christian music and talk'],
      ['Revelation TV Radio', null, 'https://icy-e-bab-04-gos.sharp-stream.com/revelationtv.mp3', 'https://www.revelationtv.com', 'United Kingdom', 'National', 14, 'Christian television and radio'],
      ['K-LOVE', null, 'https://icy-e-bab-04-gos.sharp-stream.com/klove.mp3', 'https://www.klove.com', 'United States', 'National', 14, 'Contemporary Christian music'],
      ['Air1', null, 'https://icy-e-bab-04-gos.sharp-stream.com/air1.mp3', 'https://www.air1.com', 'United States', 'National', 14, 'Positive hits radio'],
      ['Hope FM', null, 'https://streaming.hopefm.com/hopefm', 'https://www.hopefm.com', 'Australia', 'National', 14, 'Christian radio Australia'],
      ['Life FM', null, 'https://icy-e-bab-04-gos.sharp-stream.com/lifefm.mp3', 'https://www.lifefm.co.nz', 'New Zealand', 'National', 14, 'Christian radio New Zealand'],
      
      // Electronic/Dance Specialty Stations
      ['Radio 1 Dance', null, 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one_dance', 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_one_dance', 'United Kingdom', 'Digital', 7, 'Pure dance music from BBC Radio 1'],
      ['Kiss Fresh', null, 'https://icy-e-bab-04-gos.sharp-stream.com/kissfresh.mp3', 'https://www.kissfresh.co.uk', 'United Kingdom', 'Digital', 7, 'Underground and emerging dance music'],
      ['Defected Radio', null, 'https://defected.streamguys1.com/defected', 'https://www.defected.com', 'United Kingdom', 'Online', 7, 'House music from Defected Records'],
      
      // Jazz and Classical Specialty
      ['Jazz FM', '102.2 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/jazzfm.mp3', 'https://www.jazzfm.com', 'United Kingdom', 'London', 8, 'Contemporary jazz and soul music'],
      ['Scala Radio', null, 'https://icy-e-bab-04-gos.sharp-stream.com/scala.mp3', 'https://www.scalaradio.com', 'United Kingdom', 'Digital', 4, 'Classical music for modern life'],
      
      // International Music Stations
      ['FIP', null, 'https://icecast.radiofrance.fr/fip-midfi.mp3', 'https://www.radiofrance.fr/fip', 'France', 'National', 8, 'Eclectic world music from France'],
      ['Concerto', null, 'https://icecast.omroep.nl/radio4-bb-mp3', 'https://www.nporadio4.nl', 'Netherlands', 'National', 4, 'Classical music from the Netherlands'],
      ['KEXP', null, 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3', 'https://www.kexp.org', 'United States', 'Seattle', 10, 'Independent music discovery from Seattle']
    ];

    for (const station of stations) {
      await this.db.runAsync(
        'INSERT INTO stations (name, frequency, stream_url, website_url, country, region, category_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        station
      );
    }

    // Insert podcast shows - Tech and Sci-Fi as requested
    const podcastShows = [
      // Technology Podcasts
      ['The Changelog', 'Conversations with the hackers, leaders, and innovators of the software world.', 'The Changelog', 'https://changelog.com/podcast/feed', 'https://changelog.com/podcast', 'https://cdn.changelog.com/uploads/covers/changelog-original.png', 17, 'en'],
      ['Reply All', 'A podcast about the internet that is actually entertaining.', 'Gimlet Media', 'https://feeds.gimletmedia.com/hearreplyall', 'https://gimletmedia.com/shows/reply-all', 'https://megaphone.imgix.net/podcasts/b94b3e7a-8d4b-11e6-ab3e-73c993c4bafc/image/uploads_2F1481829304700-y6dlpq4z7g8gk9dj-3055ee1b7e8e43b2a95c5f4f8633c8b5_2FReplyAll_Square_logo.png', 17, 'en'],
      ['Darknet Diaries', 'Stories from the dark side of the Internet.', 'Jack Rhysider', 'https://feeds.megaphone.fm/darknetdiaries', 'https://darknetdiaries.com', 'https://megaphone.imgix.net/podcasts/dd0ae0e4-a61f-11e7-a6d0-17e3065a01e5/image/DN_3000x3000_v2.png', 17, 'en'],
      ['Software Engineering Daily', 'Technical interviews about software engineering.', 'Jeff Meyerson', 'https://softwareengineeringdaily.com/feed/podcast', 'https://softwareengineeringdaily.com', 'https://softwareengineeringdaily.com/wp-content/uploads/2019/05/SED_Logo_RGBColor_3000x3000.jpg', 17, 'en'],
      ['The Stack Overflow Podcast', 'A weekly podcast about programming, technology, and the Stack Overflow community.', 'Stack Overflow', 'https://feeds.simplecast.com/XA_851k3', 'https://stackoverflow.blog/podcast', 'https://assets.fireside.fm/file/fireside-images/podcasts/images/d/d5e1eb9b-8c6e-4d59-914b-e02199b8e6f5/cover.jpg', 17, 'en'],
      ['Syntax', 'A Tasty Treats Podcast for Web Developers.', 'Wes Bos & Scott Tolinski', 'https://feed.syntax.fm/rss', 'https://syntax.fm', 'https://syntax.fm/static/logo.png', 17, 'en'],
      ['The Vergecast', 'The flagship podcast of The Verge, discussing technology, science, art, and culture.', 'The Verge', 'https://feeds.megaphone.fm/vergecast', 'https://www.theverge.com/the-vergecast', 'https://megaphone.imgix.net/podcasts/c8c7dfa4-a4e6-11e9-99bf-076c7ddb3b59/image/Vergecast_3000.jpg', 17, 'en'],
      ['This Week in Tech (TWiT)', 'A roundtable discussion of the weeks technology news.', 'Leo Laporte', 'https://feeds.twit.tv/twit.xml', 'https://twit.tv/shows/this-week-in-tech', 'https://elroycdn.twit.tv/sites/default/files/styles/twit_album_art_2048x2048/public/images/shows/this_week_in_tech/album_art/twit1400.jpg', 17, 'en'],
      
      // Science Fiction Podcasts
      ['The Magnus Archives', 'A weekly horror fiction anthology podcast examining what lurks in the archives of the Magnus Institute.', 'Rusty Quill', 'https://feeds.acast.com/public/shows/themagnusarchives', 'https://rustyquill.com/the-magnus-archives', 'https://images.acast.com/themagnusarchives/themagnusarchives/image.png', 18, 'en'],
      ['Welcome to Night Vale', 'A twice-monthly podcast in the style of community updates for the small desert town of Night Vale.', 'Night Vale Presents', 'http://feeds.nightvalepresents.com/welcometonightvalepodcast', 'http://www.welcometonightvale.com', 'https://nightvalepresents.com/wp-content/uploads/2019/01/wtnv-podcast-image.jpg', 18, 'en'],
      ['The Geeks Guide to the Galaxy', 'Science fiction podcast featuring interviews with authors, artists, and other creative professionals.', 'Wired', 'https://feeds.megaphone.fm/geeksguide', 'https://www.wired.com/category/geeks-guide-to-the-galaxy', 'https://megaphone.imgix.net/podcasts/24b02b7a-a6d0-11e7-8c16-13c3e5fb4d8e/image/GGTG_3000x3000.jpg', 18, 'en'],
      ['Escape Pod', 'The premier science fiction podcast magazine featuring original short stories.', 'Escape Artists', 'http://escapepod.org/feed/', 'http://escapepod.org', 'https://escapepod.org/wp-content/uploads/2019/02/Escape-Pod-Logo-2019-3000.jpg', 18, 'en'],
      ['Clarkesworld Magazine', 'Award-winning science fiction and fantasy magazine in audio format.', 'Clarkesworld Magazine', 'http://clarkesworld.com/podcast_rss.xml', 'http://clarkesworldmagazine.com', 'https://clarkesworldmagazine.com/wordpress/wp-content/uploads/2019/12/podcast_image.jpg', 18, 'en'],
      ['The Drabblecast', 'A weekly science fiction podcast featuring original flash fiction.', 'Norm Sherman', 'http://drabblecast.org/feed/', 'http://drabblecast.org', 'https://drabblecast.org/wp-content/uploads/2019/01/drabblecast-logo-2019.jpg', 18, 'en'],
      ['Selected Shorts', 'Short fiction read by celebrated actors and broadcast on public radio.', 'Symphony Space', 'http://feeds.feedburner.com/SelectedShorts', 'https://www.symphonyspace.org/selected-shorts', 'https://www.symphonyspace.org/sites/default/files/styles/event_detail/public/SelectedShorts_FacebookPageCover_851x315.jpg', 18, 'en'],
      ['The Truth', 'Movie-like audio dramas that are completely fictional but feel like they could be real.', 'The Truth', 'http://feeds.feedburner.com/thetruthapm', 'http://thetruthpodcast.com', 'https://thetruthpodcast.com/assets/truth-logo-2019.jpg', 18, 'en'],
      
      // Bonus Tech/Business Podcasts
      ['Startup Podcast', 'A documentary series about entrepreneurial ventures.', 'Gimlet Media', 'https://feeds.gimletmedia.com/hearstartup', 'https://gimletmedia.com/shows/startup', 'https://megaphone.imgix.net/podcasts/b94b3e7a-8d4b-11e6-ab3e-73c993c4bafc/image/uploads_2F1481829258098-h68k10bd67y5-3ca2fb29e6bb2e878efc1c5e7fc1b93b_2FStartup_Square_logo.png', 19, 'en'],
      ['How I Built This', 'Guy Raz dives into the stories behind the worlds best known companies.', 'NPR', 'https://feeds.npr.org/510313/podcast.xml', 'https://www.npr.org/podcasts/510313/how-i-built-this', 'https://media.npr.org/images/podcasts/2017/primary/hibt_sq.jpg', 19, 'en']
    ];

    for (const show of podcastShows) {
      await this.db.runAsync(
        'INSERT INTO podcast_shows (title, description, author, feed_url, website_url, image_url, category_id, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        show
      );
    }
  }

  async getAllStations(): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.is_active = 1
      ORDER BY s.country, s.name
    `);
    
    return result as StationWithCategory[];
  }

  async getStationsByCountry(country: string): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.country = ? AND s.is_active = 1
      ORDER BY s.name
    `, [country]);
    
    return result as StationWithCategory[];
  }

  async getStationsByCategory(categoryId: number): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.category_id = ? AND s.is_active = 1
      ORDER BY s.name
    `, [categoryId]);
    
    return result as StationWithCategory[];
  }

  async getAllCategories(): Promise<Category[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync('SELECT * FROM categories ORDER BY name');
    return result as Category[];
  }

  async searchStations(query: string): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const searchQuery = `%${query}%`;
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE (s.name LIKE ? OR s.description LIKE ?) AND s.is_active = 1
      ORDER BY s.name
    `, [searchQuery, searchQuery]);
    
    return result as StationWithCategory[];
  }

  async getStationById(id: number): Promise<StationWithCategory | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.id = ?
    `, [id]);
    
    return result as StationWithCategory | null;
  }

  // Podcast-related methods
  async getAllPodcastShows(): Promise<ShowWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT 
        s.*,
        c.name as category_name,
        COUNT(e.id) as episode_count,
        MAX(e.published_at) as latest_episode
      FROM podcast_shows s 
      LEFT JOIN categories c ON s.category_id = c.id 
      LEFT JOIN podcast_episodes e ON s.id = e.show_id
      WHERE s.is_active = 1
      GROUP BY s.id
      ORDER BY s.title
    `);
    
    return result as ShowWithCategory[];
  }

  async getPodcastShowsByCategory(categoryId: number): Promise<ShowWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT 
        s.*,
        c.name as category_name,
        COUNT(e.id) as episode_count,
        MAX(e.published_at) as latest_episode
      FROM podcast_shows s 
      LEFT JOIN categories c ON s.category_id = c.id 
      LEFT JOIN podcast_episodes e ON s.id = e.show_id
      WHERE s.category_id = ? AND s.is_active = 1
      GROUP BY s.id
      ORDER BY s.title
    `, [categoryId]);
    
    return result as ShowWithCategory[];
  }

  async searchPodcastShows(query: string): Promise<ShowWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const searchQuery = `%${query}%`;
    const result = await this.db.getAllAsync(`
      SELECT 
        s.*,
        c.name as category_name,
        COUNT(e.id) as episode_count,
        MAX(e.published_at) as latest_episode
      FROM podcast_shows s 
      LEFT JOIN categories c ON s.category_id = c.id 
      LEFT JOIN podcast_episodes e ON s.id = e.show_id
      WHERE (s.title LIKE ? OR s.description LIKE ? OR s.author LIKE ?) AND s.is_active = 1
      GROUP BY s.id
      ORDER BY s.title
    `, [searchQuery, searchQuery, searchQuery]);
    
    return result as ShowWithCategory[];
  }

  async getPodcastShowById(id: number): Promise<ShowWithCategory | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(`
      SELECT 
        s.*,
        c.name as category_name,
        COUNT(e.id) as episode_count,
        MAX(e.published_at) as latest_episode
      FROM podcast_shows s 
      LEFT JOIN categories c ON s.category_id = c.id 
      LEFT JOIN podcast_episodes e ON s.id = e.show_id
      WHERE s.id = ?
      GROUP BY s.id
    `, [id]);
    
    return result as ShowWithCategory | null;
  }

  async getEpisodesByShow(showId: number, limit: number = 50): Promise<PodcastEpisode[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT * FROM podcast_episodes 
      WHERE show_id = ? 
      ORDER BY published_at DESC 
      LIMIT ?
    `, [showId, limit]);
    
    return result as PodcastEpisode[];
  }

  async addPodcastShow(show: Omit<PodcastShow, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO podcast_shows (title, description, author, feed_url, website_url, image_url, category_id, language, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [show.title, show.description || null, show.author || null, show.feed_url, show.website_url || null, show.image_url || null, show.category_id || null, show.language || 'en', show.is_active]
    );
    
    return result.lastInsertRowId || 0;
  }

  async addPodcastEpisode(episode: Omit<PodcastEpisode, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO podcast_episodes (show_id, title, description, audio_url, duration, published_at, episode_number, season_number, file_size, is_downloaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [episode.show_id, episode.title, episode.description || null, episode.audio_url, episode.duration || null, episode.published_at, episode.episode_number || null, episode.season_number || null, episode.file_size || null, episode.is_downloaded]
    );
    
    return result.lastInsertRowId || 0;
  }
}

export const databaseService = new DatabaseService();