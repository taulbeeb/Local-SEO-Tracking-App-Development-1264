// Frontend service to communicate with SERP API
class SerpApiService {
  constructor() {
    // Use absolute paths to ensure consistent resolution in all environments
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001/api'
      : '/api';
    
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
        // Ensure credentials are included for any auth cookies
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

  async addTrackingJob(keywordData, priority = 'normal') {
    try {
      const response = await fetch(`${this.baseUrl}/serp/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...keywordData, priority }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`Failed to add tracking job: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add tracking job error:', error);
      throw error;
    }
  }

  async getQueueStats() {
    try {
      const response = await fetch(`${this.baseUrl}/serp/queue-stats`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`Failed to get queue stats: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get queue stats error:', error);
      throw error;
    }
  }

  async scheduleAllTracking(clientId) {
    try {
      const response = await fetch(`${this.baseUrl}/serp/schedule-all/${clientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`Failed to schedule tracking: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Schedule all tracking error:', error);
      throw error;
    }
  }

  async getTrackingResults(clientId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      
      const response = await fetch(`${this.baseUrl}/tracking/results/${clientId}?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`Failed to get tracking results: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get tracking results error:', error);
      throw error;
    }
  }

  async getRankingTrends(keywordId, locationId, days = 30) {
    try {
      const response = await fetch(`${this.baseUrl}/tracking/trends/${keywordId}/${locationId}?days=${days}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`Failed to get ranking trends: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get ranking trends error:', error);
      throw error;
    }
  }
}

export default new SerpApiService();