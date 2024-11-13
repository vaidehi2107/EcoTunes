const API_KEY = '0cbe8f3fc3fabb8834d0e0855008c319';

// Fetch Latitude and Longitude for City
function fetchLocationAndAQI() {
  const city = document.getElementById('city').value;

  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        fetchAQI(latitude, longitude);
      } else {
        alert("City not found. Please enter a valid city name.");
      }
    })
    .catch(error => console.error('Error fetching location:', error));
}

// Fetch AQI Data Using Coordinates
function fetchAQI(latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const aqi = data.list[0].main.aqi;
      document.getElementById('aqi-value').textContent = `AQI: ${aqi}`;
      updateVisuals(aqi);
      provideSolutions(aqi);
    })
    .catch(error => console.error('Error fetching AQI:', error));
}

function generateSound() {
    const aqi = parseInt(document.getElementById('aqi-value').textContent.split(': ')[1]);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();

    // Set the frequency based on AQI
    const frequency = aqi <= 1 ? 800 : 
                      aqi === 2 ? 600 : 
                      aqi === 3 ? 350 : 
                      aqi === 4 ? 250 : 
                      100;  // Frequency adjustment based on AQI scale (1-5)
    
    // Set the oscillator type based on AQI
    let oscillatorType;
    if (aqi === 1) {
        oscillatorType = 'triangle';  // Smooth sound for Good AQI
    } else if (aqi === 2) {
        oscillatorType = 'triangle';  // Slightly rough sound for Fair AQI
    } else if (aqi === 3) {
        oscillatorType = 'triangle';  // Buzzing sound for Moderate AQI
    } else if (aqi === 4) {
        oscillatorType = 'square';  // Distorted sound for Poor AQI
    } else {
        oscillatorType = 'square';  // Chaotic sound for Very Poor AQI
    }

    // Apply frequency and type to the oscillator
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = oscillatorType;
    oscillator.connect(audioContext.destination);

    // Play the sound for a dynamic duration based on AQI
    const duration = aqi <= 2 ? 1 : aqi === 3 ? 2 : 3; // Longer duration for worse AQI
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);  // Stop sound after the duration
}


  function updateVisuals(aqi) {
    const visuals = document.getElementById('visuals');
    
    if (aqi === 1) {
        visuals.style.backgroundColor = '#4CAF50';  // Green for Good AQI
    } else if (aqi === 2) {
        visuals.style.backgroundColor = '#FFEB3B';  // Yellow for Fair AQI
    } else if (aqi === 3) {
        visuals.style.backgroundColor = '#FF9800';  // Orange for Moderate AQI
    } else if (aqi === 4) {
        visuals.style.backgroundColor = '#FF5722';  // Red for Poor AQI
    } else if (aqi === 5) {
        visuals.style.backgroundColor = '#F44336';  // Dark Red for Very Poor AQI
    }
}


  function provideSolutions(aqi) {
    const solutionContent = document.getElementById('solution-content');
  
    if (aqi === 1 || aqi === 2) {
      solutionContent.innerHTML = `
        <p>Your air quality is good! Here’s how to keep it that way:</p>
        <ul>
          <li>Continue using public transportation.</li>
          <li>Support local clean energy initiatives.</li>
        </ul>
      `;
    } else if (aqi === 3) {
      solutionContent.innerHTML = `
        <p>Moderate air quality. Here’s how to help improve it:</p>
        <ul>
          <li>Carpool or use public transport to reduce emissions.</li>
          <li>Turn off lights and appliances when not in use.</li>
        </ul>
      `;
    } else {
      solutionContent.innerHTML = `
        <p>Poor air quality. Consider these actions:</p>
        <ul>
          <li>Limit outdoor activities, especially for sensitive groups.</li>
          <li>Advocate for stricter air quality regulations in your area.</li>
        </ul>
      `;
    }
  }
  