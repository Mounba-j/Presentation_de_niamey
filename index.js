// 🔗 API météo OpenWeatherMap (remplacez YOUR_API_KEY par votre clé gratuite)
const apiKey = '8bf9f7c3450402042e1c6fb88edf57a9';
const city = 'Niamey';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    document.getElementById('temp').textContent = Math.round(data.main.temp);
    document.getElementById('desc').textContent = data.weather[0].description;
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  })
  .catch(error => console.error('Erreur météo:', error)); 

// --- API REST Countries ---
fetch('https://restcountries.com/v3.1/name/Niger')
  .then(response => response.json())
  .then(data => {
    const countryData = data[1]; // L'API renvoie un tableau, on prend le premier élément

    // Formate la population avec des séparateurs de milliers
    document.getElementById('population').textContent = countryData.population.toLocaleString('fr-FR');
    
    document.getElementById('capital').textContent = countryData.capital[0];
    
    // Récupère les informations sur la monnaie
    const currencyCode = Object.keys(countryData.currencies)[0]; // ex: "XOF"
    const currencyInfo = countryData.currencies[currencyCode];
    document.getElementById('currency').textContent = `${currencyInfo.name} (${currencyCode})`;

    // Récupère la langue officielle (le français dans ce cas)
    document.getElementById('language').textContent = countryData.languages.fra;
  })
  .catch(error => {
    console.error('Erreur API Pays:', error);
    // Affiche un message d'erreur dans la section si l'appel échoue
    document.getElementById('country-info').innerHTML = "<p>Impossible de charger les informations sur le pays.</p>";
  });

// Gestion du thème
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        // Bascule entre les classes de thème sur le body
        body.classList.toggle('theme-jour');
        body.classList.toggle('theme-nuit');

        // Met à jour l'icône du bouton en fonction du thème actif
        if (body.classList.contains('theme-jour')) {
            themeToggle.textContent = '☀️'; // Icône pour le thème jour
            themeToggle.title = 'Passer au thème nuit';
        } else {
            themeToggle.textContent = '🌓'; // Icône pour le thème nuit
            themeToggle.title = 'Passer au thème jour';
        }
    });

    // --- Initialisation de la carte Leaflet ---
    // Coordonnées de Niamey: [latitude, longitude]
    const mapCoords = [13.5137, 2.1098]; 
    // Initialise la carte et la centre sur les coordonnées avec un niveau de zoom
    const map = L.map('map').setView(mapCoords, 12);

    // Ajoute le fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajoute un marqueur sur Niamey avec une popup
    L.marker(mapCoords).addTo(map)
        .bindPopup('<b>Niamey</b><br>Capitale du Niger.')
        .openPopup();

    // --- Fonctionnalité de géolocalisation ---
    const locateBtn = document.getElementById('locate-btn');
    let userMarker, accuracyCircle;

    locateBtn.addEventListener('click', () => {
        map.locate({setView: true, maxZoom: 16});
    });

    map.on('locationfound', (e) => {
        const radius = e.accuracy;

        // Supprime les anciens marqueurs/cercles s'ils existent
        if (userMarker) {
            map.removeLayer(userMarker);
            map.removeLayer(accuracyCircle);
        }

        // Ajoute un marqueur pour la position de l'utilisateur
        userMarker = L.marker(e.latlng).addTo(map)
            .bindPopup(`Vous êtes à environ ${Math.round(radius)} mètres d'ici.`).openPopup();

        // Ajoute un cercle pour montrer la précision
        accuracyCircle = L.circle(e.latlng, radius).addTo(map);
    });

    map.on('locationerror', (e) => {
        alert(e.message);
    });


    // --- Gestion de la modale pour la cuisine ---
    const modal = document.getElementById('cuisine-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeModal = document.querySelector('.close-button');

    document.querySelectorAll('.cuisine-card').forEach(card => {
        card.addEventListener('click', () => {
            // Récupère les infos de la carte cliquée
            const title = card.querySelector('h3').textContent;
            const imgSrc = card.querySelector('img').src;
            const desc = card.querySelector('p').textContent;

            // Remplit la modale avec les infos
            modalTitle.textContent = title;
            modalImg.src = imgSrc;
            modalDesc.textContent = desc;

            // Affiche la modale
            modal.style.display = 'block';
        });
    });

    // Ferme la modale en cliquant sur le bouton (X)
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Ferme la modale en cliquant en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});

