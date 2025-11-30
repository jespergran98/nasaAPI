const API_KEY = 'bjnYhxeq2HaklxVX8Lt5nwbXxFwoUz4JVLKC2wQE';
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const $ = id => document.getElementById(id);

let todayData = null;

async function fetchAPOD() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        todayData = data;
        
        displayAPOD(data);
        
        $('loading').classList.add('hidden');
        $('main-content').classList.remove('hidden');
        
        fetchPreviousYears(data.date);
    } catch (err) {
        console.error('Error:', err);
        $('loading').classList.add('hidden');
        $('error').classList.remove('hidden');
    }
}

function displayAPOD(data, showBackButton = false) {
    $('apod-image').src = data.url;
    $('apod-image').alt = data.title;
    $('apod-date').textContent = data.date;
    $('apod-title').textContent = data.title;
    $('apod-description').textContent = data.explanation;
    
    if (showBackButton) {
        $('back-to-today').classList.remove('hidden');
    } else {
        $('back-to-today').classList.add('hidden');
    }
    
    // Update active state on grid items
    document.querySelectorAll('.grid-item').forEach(item => {
        if (item.dataset.date === data.date) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Scroll to top smoothly
    $('main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

async function fetchPreviousYears(currentDate) {
    const [year, month, day] = currentDate.split('-');
    const years = Array.from({length: parseInt(year) - 1995}, (_, i) => parseInt(year) - 1 - i);
    // APOD started in June 1995
    
    $('previous-years').classList.remove('hidden');
    
    for (let i = 0; i < years.length; i++) {
        const dateStr = `${years[i]}-${month}-${day}`;
        
        fetch(`${API_URL}&date=${dateStr}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => data && displayGridItem(data))
            .catch(err => console.error(`Error ${dateStr}:`, err));
        
        if (i < years.length - 1) await new Promise(r => setTimeout(r, 100));
    }
}

function displayGridItem(item) {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.dataset.date = item.date;
    div.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <div class="year">${item.date.split('-')[0]}</div>
        <div class="grid-title">${item.title}</div>
    `;
    
    div.addEventListener('click', () => {
        displayAPOD(item, true);
    });
    
    $('grid-container').appendChild(div);
}

$('back-to-today').addEventListener('click', () => {
    if (todayData) {
        displayAPOD(todayData, false);
    }
});

fetchAPOD();