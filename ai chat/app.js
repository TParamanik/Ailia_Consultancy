const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning ");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon ");
    } else {
        speak("Good Evening ");
    }
}

window.addEventListener('load', () => {
    speak("Welcome to Ailia Artificial Intelligence, how may I help you?");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

recognition.onerror = (event) => {
    content.textContent = 'Error occurred in recognition: ' + event.error;
    speak('Sorry, I did not understand that. Could you please repeat?');
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

async function getWeather() {
    const apiKey = 'your_openweathermap_api_key';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=your_city&units=metric&appid=${apiKey}`);
    const data = await response.json();
    return data;
}

async function weatherCommand() {
    const weatherData = await getWeather();
    const temp = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const weatherText = `The current temperature is ${temp} degrees Celsius with ${description}.`;
    speak(weatherText);
}

async function getNews() {
    const apiKey = 'your_newsapi_key';
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const data = await response.json();
    return data;
}

async function newsCommand() {
    const newsData = await getNews();
    const headlines = newsData.articles.slice(0, 5).map(article => article.title).join('. ');
    const newsText = `Here are the top 5 news headlines: ${headlines}`;
    speak(newsText);
}

async function getJoke() {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    const data = await response.json();
    return data;
}

async function jokeCommand() {
    const jokeData = await getJoke();
    const jokeText = `${jokeData.setup} ... ${jokeData.punchline}`;
    speak(jokeText);
}

function setReminder(message, time) {
    const timeInMs = time * 60000; // time in minutes
    setTimeout(() => {
        speak(`Reminder: ${message}`);
    }, timeInMs);
}

function reminderCommand(message, time) {
    setReminder(message, time);
    speak(`Reminder set for ${time} minutes from now.`);
}

function playMusic() {
    window.open('https://open.spotify.com/', '_blank');
    speak('Opening Spotify...');
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
    speak('Stopped speaking.');
}

async function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir!");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("hospitals near me")) {
        window.open("https://www.google.com/maps/search/hospitals+near+me+/", "_blank");
        speak("Showing hospitals near you...");
    } else if (message.includes("open wellness journal")) {
        window.open("./journal/index.html", "_blank");
        speak("Opening wellness journal...");
    }
     else if (message.includes("open tracker")) {
        window.open("./newtracker/index.html", "_blank");
        speak("Opening medical tracker...");
     }
        else if (message.includes("open tracker")) {
            window.open("./newtracker/index.html", "_blank");
            speak("Opening medical tracker...");
    } 
    
    
    
    
    else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        const query = message.replace("wikipedia", "").trim().replace(/ /g, "_");
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        speak("Today's date is " + date);
    } else if (message.includes('calculator')) {
        try {
            window.open('Calculator:///');
            speak("Opening Calculator");
        } catch (e) {
            speak("Sorry, I can't open the calculator.");
        }
    } else if (message.includes('weather')) {
        await weatherCommand();
    } else if (message.includes('news')) {
        await newsCommand();
    } else if (message.includes('joke')) {
        await jokeCommand();
    } else if (message.includes('remind me to')) {
        const reminderMessage = message.replace('remind me to', '').trim();
        const time = parseInt(message.match(/\d+/)[0], 10);
        reminderCommand(reminderMessage, time);
    } else if (message.includes('play music')) {
        playMusic();
    } else if (message.includes('stop')) {
        stopSpeaking();
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("I found some information for " + message + " on Google.");
    }
}
