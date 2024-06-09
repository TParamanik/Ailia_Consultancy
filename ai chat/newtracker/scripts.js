document.addEventListener('DOMContentLoaded', loadMedications);
document.getElementById('medication-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('medication-name').value;
    const time = document.getElementById('medication-time').value;
    const dosage = document.getElementById('medication-dosage').value;
    const category = document.getElementById('medication-category').value;

    if (name && time && dosage && category) {
        addMedication(name, time, dosage, category);
        saveMedications();
        document.getElementById('medication-form').reset();
    }
});

document.getElementById('search').addEventListener('input', function(e) {
    const searchValue = e.target.value.toLowerCase();
    document.querySelectorAll('#medication-list li').forEach(li => {
        const text = li.querySelector('span').textContent.toLowerCase();
        if (text.includes(searchValue)) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    });
});

function addMedication(name, time, dosage, category, taken = false) {
    const medicationList = document.getElementById('medication-list');

    const li = document.createElement('li');
    if (taken) {
        li.classList.add('taken');
    }
    li.innerHTML = `
        <span>${name} - ${time} - ${dosage} - ${category}</span>
        <div class="actions">
            <button class="edit-button">Edit</button>
            <button class="taken-button">${taken ? 'Untaken' : 'Taken'}</button>
            <button class="delete-button">Delete</button>
        </div>
    `;

    li.querySelector('.delete-button').addEventListener('click', function() {
        li.remove();
        saveMedications();
    });

    li.querySelector('.edit-button').addEventListener('click', function() {
        editMedication(li, name, time, dosage, category);
    });

    li.querySelector('.taken-button').addEventListener('click', function() {
        li.classList.toggle('taken');
        this.textContent = li.classList.contains('taken') ? 'Untaken' : 'Taken';
        saveMedications();
    });

    medicationList.appendChild(li);
    scheduleNotification(name, time);
}

function editMedication(li, oldName, oldTime, oldDosage, oldCategory) {
    const name = prompt("Edit Medication Name:", oldName);
    const time = prompt("Edit Medication Time:", oldTime);
    const dosage = prompt("Edit Medication Dosage:", oldDosage);
    const category = prompt("Edit Medication Category:", oldCategory);

    if (name && time && dosage && category) {
        li.querySelector('span').textContent = `${name} - ${time} - ${dosage} - ${category}`;
        saveMedications();
    }
}

function saveMedications() {
    const medications = [];
    document.querySelectorAll('#medication-list li').forEach(li => {
        const [name, time, dosage, category] = li.querySelector('span').textContent.split(' - ');
        const taken = li.classList.contains('taken');
        medications.push({ name, time, dosage, category, taken });
    });

    localStorage.setItem('medications', JSON.stringify(medications));
}

function loadMedications() {
    const medications = JSON.parse(localStorage.getItem('medications')) || [];
    medications.forEach(({ name, time, dosage, category, taken }) => addMedication(name, time, dosage, category, taken));
}

function scheduleNotification(name, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (notificationTime > now) {
        const timeout = notificationTime - now;
        setTimeout(() => {
            alert(`Time to take your medication: ${name}`);
        }, timeout);
    }
}
