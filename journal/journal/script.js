var modal = document.getElementById("passwordModal");

function promptPassword(callback) {
    modal.style.display = "block";
    document.getElementById("passwordForm").onsubmit = function(event) {
        event.preventDefault();
        var password = document.getElementById("passwordInput").value;
        modal.style.display = "none";
        document.getElementById("passwordInput").value = ""; // Clear password input
        callback(password);
    };
}

function closeModal() {
    modal.style.display = "none";
    document.getElementById("passwordInput").value = ""; // Clear password input
}

function saveEntry() {
    var entryText = document.getElementById("journalEntry").value;
    var mood = document.getElementById("moodSelect").value;
    if (entryText.trim() !== "") {
        var entryDiv = document.createElement("div");
        entryDiv.className = "entry";
        var now = new Date();
        var timestamp = now.toLocaleString();
        entryDiv.innerHTML = "<p><strong>Timestamp:</strong> " + timestamp + "</p><p><strong>Mood:</strong> " + mood + "</p><p><strong>Entry:</strong> " + entryText + "</p>";
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            entryDiv.remove();
            updateLocalStorage();
        };
        var downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.onclick = function() {
            promptPassword(function(password) {
                if (password !== null && password !== "") {
                    downloadNoteAsFile(entryText, timestamp, mood, password);
                } else {
                    alert("Please enter a valid password.");
                }
            });
        };
        var buttonContainer = document.createElement("div");
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.style.marginTop = "10px"; // Add margin between buttons
        entryDiv.appendChild(buttonContainer);
        document.getElementById("savedEntries").appendChild(entryDiv);
        document.getElementById("journalEntry").value = "";
        updateLocalStorage();
    } else {
        alert("Please write something before saving!");
    }
}

function downloadNoteAsFile(text, timestamp, mood, password) {
    var noteContent = "Timestamp: " + timestamp + "\nMood: " + mood + "\nEntry: " + text;
    var filename = "Journal_Entry_" + timestamp.replace(/[\/\s,:]/g, "_") + ".txt";

    var zip = new JSZip();
    zip.file(filename, noteContent);

    zip.generateAsync({ type: "blob", password: password })
        .then(function(content) {
            saveAs(content, filename + ".zip");
        });
}

function updateLocalStorage() {
    var entries = document.querySelectorAll(".entry");
    var entriesArray = Array.from(entries).map(entry => entry.innerHTML);
    localStorage.setItem("journalEntries", JSON.stringify(entriesArray));
}

function loadEntries() {
    var savedEntries = JSON.parse(localStorage.getItem("journalEntries"));
    if (savedEntries) {
        savedEntries.forEach(entry => {
            var entryDiv = document.createElement("div");
            entryDiv.className = "entry";
            entryDiv.innerHTML = entry;
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() {
                entryDiv.remove();
                updateLocalStorage();
            };
            var downloadButton = document.createElement("button");
            downloadButton.textContent = "Download";
            downloadButton.onclick = function() {
                var entryText = entryDiv.querySelector('p:nth-child(3)').textContent.split('Entry: ')[1];
                var timestamp = entryDiv.querySelector('p:first-child').textContent.split('Timestamp: ')[1];
                var mood = entryDiv.querySelector('p:nth-child(2)').textContent.split('Mood: ')[1];
                promptPassword(function(password) {
                    if (password !== null && password !== "") {
                        downloadNoteAsFile(entryText, timestamp, mood, password);
                    } else {
                        alert("Please enter a valid password.");
                    }
                });
            };
            var buttonContainer = document.createElement("div");
            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.style.marginTop = "10px"; // Add margin between buttons
            entryDiv.appendChild(buttonContainer);
            document.getElementById("savedEntries").appendChild(entryDiv);
        });
    }
}

function searchEntries() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    var entries = document.querySelectorAll(".entry");
    entries.forEach(entry => {
        var entryText = entry.textContent.toLowerCase();
        if (entryText.includes(searchInput)) {
            entry.style.display = "block";
        } else {
            entry.style.display = "none";
        }
    });
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    var entries = document.querySelectorAll(".entry");
    entries.forEach(entry => {
        entry.style.display = "block";
    });
}

window.onload = function() {
    loadEntries();
};


