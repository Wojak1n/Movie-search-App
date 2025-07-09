# Movie Search App

A beautiful, responsive movie search application built with HTML, JavaScript, and Tailwind CSS. Search for movies, TV shows, and episodes using the OMDB API.

## Features

- 🎬 Search movies, TV shows, and episodes
- 🎨 Modern, responsive design with glass morphism effects
- 🔍 Advanced filtering by type and year
- 📱 Mobile-friendly interface
- ⭐ Detailed movie information with ratings, cast, plot, etc.
- 📄 Pagination for search results
- 🎯 Interactive modal for movie details

## Setup Instructions

1. **Get an OMDB API Key**
   - Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Sign up for a free API key

2. **Configure the API Key**
   - Open `script.js`
   - Replace `'YOUR_API_KEY'` on line 2 with your actual API key:
   ```javascript
   const API_KEY = 'your-actual-api-key-here';
   ```

3. **Run the Application**
   - Open `index.html` in your web browser
   - Or serve it using a local server for better performance

## Usage

1. **Search**: Enter a movie, TV show, or episode title in the search box
2. **Filter**: Use the dropdown filters to narrow results by type or year
3. **Browse**: Navigate through results using pagination
4. **Details**: Click on any movie card to view detailed information
5. **Responsive**: Works perfectly on desktop, tablet, and mobile devices

## Technologies Used

- **HTML5**: Semantic markup structure
- **JavaScript (ES6+)**: Modern JavaScript with async/await
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icons
- **OMDB API**: Movie database API

## Design Features

- **Glass Morphism**: Modern glass effect design
- **Gradient Backgrounds**: Beautiful color gradients
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## API Limitations

- Free OMDB API key allows 1,000 requests per day
- For higher usage, consider upgrading to a paid plan

## License

This project is open source and available under the MIT License.