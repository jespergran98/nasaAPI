// NASA APOD API endpoint with API key
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

// Elements
const loading = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const content = document.getElementById('content');
const error = document.getElementById('error');
const image = document.getElementById('apod-image');
const date = document.getElementById('apod-date');
const title = document.getElementById('apod-title');
const description = document.getElementById('apod-description');
const previousYears = document.getElementById('previous-years');
const gridContainer = document.getElementById('grid-container');

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
        mainContent.classList.remove('hidden');
        
        // Fetch previous years
        fetchPreviousYears(data.date);
        
    } catch (err) {
        console.error('Error fetching APOD:', err);
        loading.classList.add('hidden');
        error.classList.remove('hidden');
    }
}

// Fetch previous years on this date
async function fetchPreviousYears(currentDate) {
    const [year, month, day] = currentDate.split('-');
    const currentYear = parseInt(year);
    const startYear = 1995; // APOD started in June 1995
    
    // Generate array of previous years
    const years = [];
    for (let y = currentYear - 1; y >= startYear; y--) {
        years.push(y);
    }
    
    // Show the section immediately
    previousYears.classList.remove('hidden');
    
    // Fetch and display each year as it loads
    for (let i = 0; i < years.length; i++) {
        const y = years[i];
        const dateStr = `${y}-${month}-${day}`;
        
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dateStr}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    displayGridItem(data);
                }
            })
            .catch(err => console.error(`Error fetching ${dateStr}:`, err));
        
        // Small delay between requests
        if (i < years.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

// Display a single grid item
function displayGridItem(item) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.title;
    
    const yearDiv = document.createElement('div');
    yearDiv.className = 'year';
    yearDiv.textContent = item.date.split('-')[0];
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'grid-title';
    titleDiv.textContent = item.title;
    
    gridItem.appendChild(img);
    gridItem.appendChild(yearDiv);
    gridItem.appendChild(titleDiv);
    
    gridContainer.appendChild(gridItem);
}

// Load APOD on page load
fetchAPOD();