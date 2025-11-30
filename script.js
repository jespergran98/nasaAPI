// NASA APOD API endpoint (using DEMO_KEY for testing - replace with your own API key for production)
const API_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

// Elements
const loading = document.getElementById('loading');
const content = document.getElementById('content');
const error = document.getElementById('error');
const image = document.getElementById('apod-image');
const date = document.getElementById('apod-date');
const title = document.getElementById('apod-title');
const description = document.getElementById('apod-description');

// Fetch APOD data
async function fetchAPOD() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        // Update UI
        image.src = data.url;
        image.alt = data.title;
        date.textContent = data.date;
        title.textContent = data.title;
        description.textContent = data.explanation;
        
        // Show content, hide loading
        loading.classList.add('hidden');
        content.classList.remove('hidden');
        
    } catch (err) {
        console.error('Error fetching APOD:', err);
        loading.classList.add('hidden');
        error.classList.remove('hidden');
    }
}

// Load APOD on page load
fetchAPOD();