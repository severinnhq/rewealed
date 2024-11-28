export const config = {
    get baseUrl() {
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000'
      }
      // For production on rewealed.com
      return 'https://rewealed.com'
    },
    
    get imageBaseUrl() {
      return `${this.baseUrl}/uploads`
    }
  }
  
  