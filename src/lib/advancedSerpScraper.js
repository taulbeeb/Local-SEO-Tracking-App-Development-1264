import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Pool } from 'generic-pool';

puppeteer.use(StealthPlugin());

class AdvancedSerpScraper {
  constructor() {
    this.browserPool = Pool.createPool({
      create: async () => {
        return await puppeteer.launch({
          args: [
            '--proxy-server=proxy.example.com:8080',
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]
        });
      },
      destroy: async (browser) => {
        await browser.close();
      }
    }, {
      max: 5, // Maximum browsers in pool
      min: 2  // Minimum browsers to keep ready
    });
  }

  async searchGoogle(keyword, location) {
    const browser = await this.browserPool.acquire();
    try {
      const page = await browser.newPage();
      
      // Set geolocation
      await page.setGeolocation({
        latitude: location.lat,
        longitude: location.lng
      });

      await page.goto(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}`
      );

      // Wait for results to load
      await page.waitForSelector('#search');

      // Extract results
      const results = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.g').forEach((el) => {
          items.push({
            title: el.querySelector('h3')?.textContent,
            url: el.querySelector('a')?.href,
            snippet: el.querySelector('.VwiC3b')?.textContent
          });
        });
        return items;
      });

      return results;
    } finally {
      await this.browserPool.release(browser);
    }
  }
}