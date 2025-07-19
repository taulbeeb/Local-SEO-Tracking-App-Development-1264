// Frontend service to communicate with SERP API
class SerpApiService {
  constructor() {
    // Use relative paths for API calls
    this.baseUrl = '/api';
    console.log('SerpAPI initialized with baseUrl:', this.baseUrl);
  }

  async testSearch(keyword, location) {
    try {
      console.log(`Making test search request: ${keyword} in ${location.name}`);
      
      const response = await fetch(`${this.baseUrl}/serp/test-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, location }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search successful, received data:', data);
      return data;
    } catch (error) {
      console.error('Test search error:', error);
      throw error;
    }
  }

  async getQueueStats() {
    try {
      const response = await fetch(`${this.baseUrl}/serp/queue-stats`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to get queue stats: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get queue stats error:', error);
      throw error;
    }
  }
}

export default new SerpApiService();