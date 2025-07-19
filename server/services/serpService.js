import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';

puppeteer.use(StealthPlugin());

class SerpService {
  constructor() {
    this.browser = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized && this.browser) return;

    try {
      console.log('Initializing Puppeteer browser...');
      
      const launchOptions = {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      };

      // Use custom Chromium path in production (Railway)
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        console.log(`Using custom Chromium at: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }

      this.browser = await puppeteer.launch(launchOptions);
      this.isInitialized = true;
      console.log('Browser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async searchGoogle(keyword, location) {
    await this.initialize();
    const page = await this.browser.newPage();

    try {
      console.log(`Searching for: ${keyword} in ${location.name}`);

      // Configure page
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Set geolocation if provided
      if (location.lat && location.lng) {
        await page.setGeolocation({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lng)
        });
      }

      // Build search URL
      const searchQuery = encodeURIComponent(keyword);
      const locationQuery = location.name ? encodeURIComponent(location.name) : '';
      const searchUrl = `https://www.google.com/search?q=${searchQuery}&near=${locationQuery}&num=100`;

      // Navigate and wait for results
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('#search', { timeout: 10000 });

      // Get page content
      const content = await page.content();

      // Parse results
      const results = this.parseSearchResults(content, keyword, location);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  parseSearchResults(html, keyword, location) {
    const $ = cheerio.load(html);
    const results = {
      keyword,
      location: location.name,
      timestamp: new Date().toISOString(),
      organic: [],
      mapPack: [],
      totalResults: 0
    };

    // Parse organic results
    $('#search .g').each((index, element) => {
      const $element = $(element);
      const title = $element.find('h3').first().text().trim();
      const url = $element.find('a').first().attr('href');
      const snippet = $element.find('.VwiC3b, .s3v9rd').first().text().trim();

      if (title && url && !url.startsWith('/search')) {
        results.organic.push({
          position: index + 1,
          title,
          url: url.startsWith('/url?') ? this.extractUrlFromGoogle(url) : url,
          snippet,
          domain: this.extractDomain(url)
        });
      }
    });

    // Parse map pack results
    $('[data-ved] .rllt__details').each((index, element) => {
      const $element = $(element);
      const title = $element.find('.dbg0pd').text().trim();
      const address = $element.find('.rllt__details div:last-child').text().trim();

      if (title) {
        results.mapPack.push({
          position: index + 1,
          title,
          address,
          type: 'local'
        });
      }
    });

    // Get total results count
    const statsText = $('#result-stats').text();
    const totalMatch = statsText.match(/About ([\d,]+) results/);
    if (totalMatch) {
      results.totalResults = parseInt(totalMatch[1].replace(/,/g, ''));
    }

    return results;
  }

  extractUrlFromGoogle(googleUrl) {
    try {
      const url = new URL(googleUrl, 'https://google.com');
      return url.searchParams.get('url') || googleUrl;
    } catch {
      return googleUrl;
    }
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        this.isInitialized = false;
        console.log('Browser closed successfully');
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
}

export default new SerpService();