const API_KEY = 'bjnYhxeq2HaklxVX8Lt5nwbXxFwoUz4JVLKC2wQE';
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const $ = id => document.getElementById(id);

async function fetchAPOD() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        
        $('apod-image').src = data.url;
        $('apod-image').alt = data.title;
        $('apod-date').textContent = data.date;
        $('apod-title').textContent = data.title;
        $('apod-description').textContent = data.explanation;
        
        $('loading').classList.add('hidden');
        $('main-content').classList.remove('hidden');
        
        fetchPreviousYears(data.date);
    } catch (err) {
        console.error('Error:', err);
        $('loading').classList.add('hidden');
        $('error').classList.remove('hidden');
    }
}

async function fetchPreviousYears(currentDate) {
    const [year, month, day] = currentDate.split('-');
    const years = Array.from({length: parseInt(year) - 1995}, (_, i) => parseInt(year) - 1 - i);
    
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
    div.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <div class="year">${item.date.split('-')[0]}</div>
        <div class="grid-title">${item.title}</div>
    `;
    $('grid-container').appendChild(div);
}

fetchAPOD();