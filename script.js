// OMDB API Configuration
const API_KEY = 'befac4e7'; // Your OMDB API key
const API_URL = 'https://www.omdbapi.com/';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const typeFilter = document.getElementById('typeFilter');
const yearFilter = document.getElementById('yearFilter');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultsSection = document.getElementById('resultsSection');
const moviesGrid = document.getElementById('moviesGrid');
const noResults = document.getElementById('noResults');
const resultCount = document.getElementById('resultCount');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const movieModal = document.getElementById('movieModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Navigation Elements
const moviesNav = document.getElementById('moviesNav');
const tvShowsNav = document.getElementById('tvShowsNav');
const popularNav = document.getElementById('popularNav');
const watchlistNav = document.getElementById('watchlistNav');
const watchlistCount = document.getElementById('watchlistCount');

// Mobile Navigation Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const moviesNavMobile = document.getElementById('moviesNavMobile');
const tvShowsNavMobile = document.getElementById('tvShowsNavMobile');
const popularNavMobile = document.getElementById('popularNavMobile');
const watchlistNavMobile = document.getElementById('watchlistNavMobile');
const watchlistCountMobile = document.getElementById('watchlistCountMobile');

// State
let currentPage = 1;
let totalResults = 0;
let currentSearch = '';
let currentType = '';
let currentYear = '';
let currentNavMode = 'search'; // 'search', 'movies', 'tvshows', 'popular'

// Watchlist functionality
let watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeYearFilter();
    setupEventListeners();
    updateWatchlistCount();

    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY') {
        showError('Please set your OMDB API key in script.js. Get one free at http://www.omdbapi.com/apikey.aspx');
    }
});

// Initialize year filter with recent years
function initializeYearFilter() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Setup event listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    typeFilter.addEventListener('change', handleSearch);
    yearFilter.addEventListener('change', handleSearch);

    // Navigation event listeners
    moviesNav.addEventListener('click', () => handleNavigation('movies'));
    tvShowsNav.addEventListener('click', () => handleNavigation('tvshows'));
    popularNav.addEventListener('click', () => handleNavigation('popular'));
    watchlistNav.addEventListener('click', () => handleNavigation('watchlist'));

    // Mobile navigation event listeners
    moviesNavMobile.addEventListener('click', () => {
        handleNavigation('movies');
        toggleMobileMenu();
    });
    tvShowsNavMobile.addEventListener('click', () => {
        handleNavigation('tvshows');
        toggleMobileMenu();
    });
    popularNavMobile.addEventListener('click', () => {
        handleNavigation('popular');
        toggleMobileMenu();
    });
    watchlistNavMobile.addEventListener('click', () => {
        handleNavigation('watchlist');
        toggleMobileMenu();
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            if (currentNavMode === 'search') {
                performSearch();
            } else {
                performNavigation();
            }
        }
    });

    nextPage.addEventListener('click', () => {
        const maxPages = Math.ceil(totalResults / 10);
        if (currentPage < maxPages) {
            currentPage++;
            if (currentNavMode === 'search') {
                performSearch();
            } else {
                performNavigation();
            }
        }
    });

    closeModal.addEventListener('click', hideModal);
    movieModal.addEventListener('click', function(e) {
        if (e.target === movieModal) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !movieModal.classList.contains('hidden')) {
            hideModal();
        }
    });
}

// Handle search
function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a search term');
        return;
    }

    currentNavMode = 'search';
    currentSearch = query;
    currentType = typeFilter.value;
    currentYear = yearFilter.value;
    currentPage = 1;

    updateNavActiveState();
    performSearch();
}

// Handle navigation clicks
function handleNavigation(navType) {
    currentNavMode = navType;
    currentPage = 1;

    // Clear search input and filters
    searchInput.value = '';
    typeFilter.value = '';
    yearFilter.value = '';

    updateNavActiveState();

    if (navType === 'watchlist') {
        displayWatchlist();
    } else {
        performNavigation();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Update navigation active state
function updateNavActiveState() {
    // Reset all nav items (desktop and mobile)
    [moviesNav, tvShowsNav, popularNav, watchlistNav, moviesNavMobile, tvShowsNavMobile, popularNavMobile, watchlistNavMobile].forEach(nav => {
        nav.classList.remove('text-white', 'bg-gray-800');
        nav.classList.add('text-gray-300');
    });

    // Highlight active nav item
    if (currentNavMode === 'movies') {
        [moviesNav, moviesNavMobile].forEach(nav => {
            nav.classList.remove('text-gray-300');
            nav.classList.add('text-white', 'bg-gray-800');
        });
    } else if (currentNavMode === 'tvshows') {
        [tvShowsNav, tvShowsNavMobile].forEach(nav => {
            nav.classList.remove('text-gray-300');
            nav.classList.add('text-white', 'bg-gray-800');
        });
    } else if (currentNavMode === 'popular') {
        [popularNav, popularNavMobile].forEach(nav => {
            nav.classList.remove('text-gray-300');
            nav.classList.add('text-white', 'bg-gray-800');
        });
    } else if (currentNavMode === 'watchlist') {
        [watchlistNav, watchlistNavMobile].forEach(nav => {
            nav.classList.remove('text-gray-300');
            nav.classList.add('text-white', 'bg-gray-800');
        });
    }
}

// Perform API search
async function performSearch() {
    if (API_KEY === 'befac4e7') {
        // API key is set, continue
    } else {
        showError('Please set your OMDB API key in script.js');
        return;
    }

    showLoading();
    hideError();
    hideResults();
    hideNoResults();

    try {
        const params = new URLSearchParams({
            apikey: API_KEY,
            s: currentSearch,
            page: currentPage
        });

        if (currentType) params.append('type', currentType);
        if (currentYear) params.append('y', currentYear);

        const response = await fetch(`${API_URL}?${params}`);
        const data = await response.json();

        hideLoading();

        if (data.Response === 'True') {
            displayResults(data.Search, data.totalResults);
        } else {
            showNoResults();
        }
    } catch (error) {
        hideLoading();
        showError('Failed to fetch data. Please try again.');
        console.error('Search error:', error);
    }
}

// Perform navigation-based search
async function performNavigation() {
    if (API_KEY === 'befac4e7') {
        // API key is set, continue
    } else {
        showError('Please set your OMDB API key in script.js');
        return;
    }

    showLoading();
    hideError();
    hideResults();
    hideNoResults();

    try {
        let searchQuery = '';
        let searchType = '';

        // Define search terms for different navigation options
        if (currentNavMode === 'movies') {
            // Popular movie search terms
            const movieTerms = ['action', 'adventure', 'comedy', 'drama', 'thriller', 'horror', 'romance', 'sci-fi', 'fantasy', 'animation'];
            searchQuery = movieTerms[currentPage % movieTerms.length] || 'action';
            searchType = 'movie';
        } else if (currentNavMode === 'tvshows') {
            // Popular TV show search terms
            const tvTerms = ['drama', 'comedy', 'crime', 'mystery', 'action', 'adventure', 'thriller', 'horror', 'sci-fi', 'fantasy'];
            searchQuery = tvTerms[currentPage % tvTerms.length] || 'drama';
            searchType = 'series';
        } else if (currentNavMode === 'popular') {
            // Popular content search terms (mix of movies and shows)
            const popularTerms = [
                'avengers', 'batman', 'star wars', 'harry potter', 'spider man',
                'iron man', 'captain america', 'wonder woman', 'superman', 'thor',
                'breaking bad', 'game of thrones', 'friends', 'the office', 'stranger things',
                'marvel', 'disney', 'netflix', 'amazon', 'hbo'
            ];
            searchQuery = popularTerms[(currentPage - 1) % popularTerms.length] || 'marvel';
        }

        const params = new URLSearchParams({
            apikey: API_KEY,
            s: searchQuery,
            page: currentPage
        });

        if (searchType) params.append('type', searchType);

        const response = await fetch(`${API_URL}?${params}`);
        const data = await response.json();

        hideLoading();

        if (data.Response === 'True') {
            displayResults(data.Search, data.totalResults, getNavTitle());
        } else {
            showNoResults();
        }
    } catch (error) {
        hideLoading();
        showError('Failed to fetch data. Please try again.');
        console.error('Navigation search error:', error);
    }
}

// Get title for navigation results
function getNavTitle() {
    switch (currentNavMode) {
        case 'movies':
            return 'Movies';
        case 'tvshows':
            return 'TV Shows';
        case 'popular':
            return 'Popular Content';
        default:
            return 'Search Results';
    }
}

// Display search results
function displayResults(movies, total, customTitle = null) {
    totalResults = parseInt(total);
    resultCount.textContent = totalResults.toLocaleString();

    // Update result title
    const resultTitle = document.querySelector('#resultsSection h2');
    if (customTitle) {
        resultTitle.textContent = customTitle;
    } else {
        resultTitle.textContent = 'Search Results';
    }

    // Show pagination controls
    document.getElementById('prevPage').style.display = 'block';
    document.getElementById('nextPage').style.display = 'block';
    document.getElementById('pageInfo').style.display = 'block';

    // Update pagination
    const maxPages = Math.ceil(totalResults / 10);
    pageInfo.textContent = `Page ${currentPage} of ${maxPages}`;
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === maxPages;

    // Clear previous results
    moviesGrid.innerHTML = '';

    // Create movie cards
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });

    showResults();
}

// Create movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card rounded-xl overflow-hidden shadow-xl cursor-pointer fade-in group';

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Poster';

    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${posterUrl}" alt="${movie.Title}" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="poster-overlay absolute inset-0"></div>

            <!-- Badges -->
            <div class="absolute top-3 left-3">
                <span class="type-badge text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    ${movie.Type}
                </span>
            </div>
            <div class="absolute top-3 right-3">
                <span class="year-badge text-white px-3 py-1 rounded-full text-xs font-bold">
                    ${movie.Year}
                </span>
            </div>

            <!-- Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <i class="fas fa-play text-white text-xl ml-1"></i>
                </div>
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg" title="${movie.Title}">
                    ${movie.Title}
                </h3>
                <p class="text-gray-300 text-xs opacity-90">
                    ${movie.Year}
                </p>
            </div>
        </div>
    `;

    card.addEventListener('click', () => showMovieDetails(movie.imdbID));

    return card;
}

// Show movie details in modal
async function showMovieDetails(imdbID) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const movie = await response.json();
        
        hideLoading();
        
        if (movie.Response === 'True') {
            displayMovieModal(movie);
        } else {
            showError('Failed to load movie details');
        }
    } catch (error) {
        hideLoading();
        showError('Failed to load movie details');
        console.error('Movie details error:', error);
    }
}

// Display movie details in modal
function displayMovieModal(movie) {
    modalTitle.textContent = movie.Title;

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600/1a1a1a/666666?text=No+Poster';
    const rating = movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A';
    const runtime = movie.Runtime !== 'N/A' ? movie.Runtime : 'N/A';
    const genre = movie.Genre !== 'N/A' ? movie.Genre : 'N/A';
    const director = movie.Director !== 'N/A' ? movie.Director : 'N/A';
    const actors = movie.Actors !== 'N/A' ? movie.Actors : 'N/A';
    const plot = movie.Plot !== 'N/A' ? movie.Plot : 'No plot available';
    const released = movie.Released !== 'N/A' ? movie.Released : 'N/A';
    const boxOffice = movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'N/A';

    modalContent.innerHTML = `
        <div class="grid lg:grid-cols-5 gap-8">
            <div class="lg:col-span-2">
                <div class="sticky top-8">
                    <img src="${posterUrl}" alt="${movie.Title}" class="w-full rounded-2xl shadow-2xl">
                    <div class="mt-6 space-y-3">
                        <button onclick="openTrailer('${movie.Title}', '${movie.Year}')" class="w-full netflix-red text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3">
                            <i class="fas fa-play"></i>
                            Watch Trailer
                        </button>
                        <button onclick="toggleWatchlist('${movie.imdbID}', '${movie.Title}', '${posterUrl}', '${movie.Year}', '${movie.Type}')" id="watchlistBtn-${movie.imdbID}" class="w-full bg-gray-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-3">
                            <i class="fas fa-plus"></i>
                            <span id="watchlistText-${movie.imdbID}">Add to Watchlist</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-3 space-y-6">
                <!-- Rating and Info Badges -->
                <div class="flex flex-wrap gap-3">
                    ${rating !== 'N/A' ? `<span class="rating-badge text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <i class="fas fa-star"></i> ${rating}
                    </span>` : ''}
                    <span class="year-badge text-white px-4 py-2 rounded-full text-sm font-bold">
                        ${movie.Year}
                    </span>
                    ${runtime !== 'N/A' ? `<span class="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        <i class="fas fa-clock mr-1"></i> ${runtime}
                    </span>` : ''}
                    <span class="type-badge text-white px-4 py-2 rounded-full text-sm font-bold capitalize">
                        ${movie.Type}
                    </span>
                </div>

                <!-- Plot -->
                <div>
                    <h3 class="text-2xl font-bold text-white mb-4">Overview</h3>
                    <p class="text-gray-300 text-lg leading-relaxed">${plot}</p>
                </div>

                <!-- Details Grid -->
                <div class="grid md:grid-cols-2 gap-6">
                    ${genre !== 'N/A' ? `<div class="bg-gray-800/50 p-4 rounded-xl">
                        <h4 class="text-white font-bold mb-2 flex items-center gap-2">
                            <i class="fas fa-tags text-red-500"></i> Genre
                        </h4>
                        <p class="text-gray-300">${genre}</p>
                    </div>` : ''}

                    ${director !== 'N/A' ? `<div class="bg-gray-800/50 p-4 rounded-xl">
                        <h4 class="text-white font-bold mb-2 flex items-center gap-2">
                            <i class="fas fa-video text-red-500"></i> Director
                        </h4>
                        <p class="text-gray-300">${director}</p>
                    </div>` : ''}

                    ${released !== 'N/A' ? `<div class="bg-gray-800/50 p-4 rounded-xl">
                        <h4 class="text-white font-bold mb-2 flex items-center gap-2">
                            <i class="fas fa-calendar text-red-500"></i> Released
                        </h4>
                        <p class="text-gray-300">${released}</p>
                    </div>` : ''}

                    ${boxOffice !== 'N/A' ? `<div class="bg-gray-800/50 p-4 rounded-xl">
                        <h4 class="text-white font-bold mb-2 flex items-center gap-2">
                            <i class="fas fa-dollar-sign text-red-500"></i> Box Office
                        </h4>
                        <p class="text-gray-300">${boxOffice}</p>
                    </div>` : ''}
                </div>

                <!-- Cast -->
                ${actors !== 'N/A' ? `<div class="bg-gray-800/30 p-6 rounded-xl">
                    <h4 class="text-white font-bold mb-3 flex items-center gap-2">
                        <i class="fas fa-users text-red-500"></i> Cast
                    </h4>
                    <p class="text-gray-300 leading-relaxed">${actors}</p>
                </div>` : ''}
            </div>
        </div>
    `;

    movieModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Update watchlist button state
    setTimeout(() => {
        const button = document.getElementById(`watchlistBtn-${movie.imdbID}`);
        const text = document.getElementById(`watchlistText-${movie.imdbID}`);
        const icon = button.querySelector('i');

        if (isInWatchlist(movie.imdbID)) {
            text.textContent = 'In Watchlist';
            icon.className = 'fas fa-check';
            button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
            button.classList.add('bg-green-600', 'hover:bg-green-700');
        }
    }, 100);
}

// Utility functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showResults() {
    resultsSection.classList.remove('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function showNoResults() {
    noResults.classList.remove('hidden');
}

function hideNoResults() {
    noResults.classList.add('hidden');
}

function hideModal() {
    movieModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Watchlist Functions
function updateWatchlistCount() {
    const count = watchlist.length;
    watchlistCount.textContent = count;
    watchlistCountMobile.textContent = count;
}

function isInWatchlist(imdbID) {
    return watchlist.some(item => item.imdbID === imdbID);
}

function addToWatchlist(movie) {
    if (!isInWatchlist(movie.imdbID)) {
        watchlist.push(movie);
        localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
        updateWatchlistCount();
        return true;
    }
    return false;
}

function removeFromWatchlist(imdbID) {
    const index = watchlist.findIndex(item => item.imdbID === imdbID);
    if (index > -1) {
        watchlist.splice(index, 1);
        localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
        updateWatchlistCount();
        return true;
    }
    return false;
}

function toggleWatchlist(imdbID, title, poster, year, type) {
    const movie = { imdbID, title, poster, year, type };
    const button = document.getElementById(`watchlistBtn-${imdbID}`);
    const text = document.getElementById(`watchlistText-${imdbID}`);
    const icon = button.querySelector('i');

    if (isInWatchlist(imdbID)) {
        removeFromWatchlist(imdbID);
        text.textContent = 'Add to Watchlist';
        icon.className = 'fas fa-plus';
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-gray-700', 'hover:bg-gray-600');
    } else {
        addToWatchlist(movie);
        text.textContent = 'In Watchlist';
        icon.className = 'fas fa-check';
        button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        button.classList.add('bg-green-600', 'hover:bg-green-700');
    }
}

function displayWatchlist() {
    hideError();
    hideNoResults();

    if (watchlist.length === 0) {
        showNoResults();
        const noResultsDiv = document.getElementById('noResults');
        noResultsDiv.innerHTML = `
            <div class="text-center py-16">
                <div class="dark-card rounded-2xl p-12 max-w-lg mx-auto">
                    <div class="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <i class="fas fa-bookmark text-3xl text-gray-500"></i>
                    </div>
                    <h3 class="text-2xl font-semibold text-white mb-4">Your Watchlist is Empty</h3>
                    <p class="text-gray-400 text-lg leading-relaxed mb-6">
                        Start adding movies and TV shows to your watchlist to keep track of what you want to watch.
                    </p>
                    <button onclick="handleNavigation('popular')" class="netflix-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all">
                        Browse Popular Content
                    </button>
                </div>
            </div>
        `;
        return;
    }

    // Display watchlist items
    totalResults = watchlist.length;
    const resultTitle = document.querySelector('#resultsSection h2');
    resultTitle.textContent = 'My Watchlist';

    const resultCountEl = document.getElementById('resultCount');
    resultCountEl.textContent = totalResults.toLocaleString();

    // Hide pagination for watchlist
    document.getElementById('prevPage').style.display = 'none';
    document.getElementById('nextPage').style.display = 'none';
    document.getElementById('pageInfo').style.display = 'none';

    // Clear previous results
    moviesGrid.innerHTML = '';

    // Create movie cards for watchlist items
    watchlist.forEach(movie => {
        const movieCard = createWatchlistCard(movie);
        moviesGrid.appendChild(movieCard);
    });

    showResults();
}

function createWatchlistCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card rounded-xl overflow-hidden shadow-xl cursor-pointer fade-in group relative';

    const posterUrl = movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Poster';

    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${posterUrl}" alt="${movie.title}" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="poster-overlay absolute inset-0"></div>

            <!-- Remove from Watchlist Button -->
            <button onclick="removeFromWatchlistAndRefresh('${movie.imdbID}')" class="absolute top-3 right-3 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all">
                <i class="fas fa-times text-white text-sm"></i>
            </button>

            <!-- Badges -->
            <div class="absolute top-3 left-3">
                <span class="type-badge text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    ${movie.type}
                </span>
            </div>

            <!-- Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <i class="fas fa-play text-white text-xl ml-1"></i>
                </div>
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg" title="${movie.title}">
                    ${movie.title}
                </h3>
                <p class="text-gray-300 text-xs opacity-90">
                    ${movie.year}
                </p>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            showMovieDetails(movie.imdbID);
        }
    });

    return card;
}

function removeFromWatchlistAndRefresh(imdbID) {
    removeFromWatchlist(imdbID);
    displayWatchlist(); // Refresh the watchlist display
}

// Trailer Functions
function openTrailer(title, year) {
    // Create YouTube search query
    const query = encodeURIComponent(`${title} ${year} trailer`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;

    // Open in new tab
    window.open(youtubeUrl, '_blank');
}
