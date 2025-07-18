import axios from 'axios';
import cheerio from 'cheerio';

class SerpScraper {
  constructor() {
    this.proxies = [
      // Rotate through multiple proxy IPs
      'http://proxy1.example.com',
      'http://proxy2.example.com'
    ];
    this.userAgents = [
      // Rotate user agents
      'Mozilla/5.0...',
      'Mozilla/5.0...'
    ];
  }

  async searchGoogle(keyword, location) {
    try {
      const proxy = this.getRandomProxy();
      const userAgent = this.getRandomUserAgent();
      
      const response = await axios.get(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}&near=${encodeURIComponent(location)}`,
        {
          proxy,
          headers: {
            'User-Agent': userAgent
          }
        }
      );

      return this.parseResults(response.data);
    } catch (error) {
      console.error('SERP scraping error:', error);
      throw error;
    }
  }

  parseResults(html) {
    const $ = cheerio.load(html);
    const results = [];
    
    // Parse organic results
    $('.g').each((i, elem) => {
      results.push({
        title: $(elem).find('h3').text(),
        url: $(elem).find('a').attr('href'),
        snippet: $(elem).find('.VwiC3b').text()
      });
    });

    return results;
  }
}