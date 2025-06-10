const appVersion = 'v1.3'; // ← change ce numéro quand tu modifies ton site

if (localStorage.getItem('appVersion') !== appVersion) {
  localStorage.clear(); // efface toutes les anciennes données locales
  localStorage.setItem('appVersion', appVersion); // enregistre la nouvelle version
}







const program = [
  {
    day: "Lundi",
    type: "Haut du corps – Push",
    exercises: [
      { name: "Chest press (machine)", muscles: "Poitrine", weight: "15–30 kg", series: "3", reps: "10", rest: "60–90 sec" },
      { name: "Développé épaules guidé", muscles: "Épaules", weight: "10–20 kg", series: "3", reps: "10", rest: "60–90 sec" },
      { name: "Élévations latérales", muscles: "Épaules", weight: "4–8 kg", series: "3", reps: "12", rest: "60–90 sec" },
      { name: "Triceps poulie", muscles: "Triceps", weight: "10–20 kg", series: "3", reps: "10", rest: "60–90 sec" },
      { name: "Pompes (optionnel)", muscles: "Poitrine, triceps", weight: "Poids du corps", series: "3", reps: "Max", rest: "60–90 sec" }
    ]
  },
  {
    day: "Mardi",
    type: "Bas du corps",
    exercises: [
      { name: "Leg press", muscles: "Jambes", weight: "40–80 kg", series: "3", reps: "10", rest: "90–120 sec" },
      { name: "Leg curl (ischio)", muscles: "Ischio-jambiers", weight: "20–35 kg", series: "3", reps: "12", rest: "60–90 sec" },
      { name: "Leg extension", muscles: "Quadriceps", weight: "20–35 kg", series: "3", reps: "12", rest: "60–90 sec" },
      { name: "Mollets machine", muscles: "Mollets", weight: "30–50 kg", series: "3", reps: "15", rest: "60–90 sec" },
      { name: "Gainage", muscles: "Abdos", weight: "30–60 sec", series: "3", reps: "1", rest: "30 sec" }
    ]
  },
  {
    day: "Mercredi",
    type: "Repos ou activité cardio/légère"
  },
  {
    day: "Jeudi",
    type: "Haut du corps – Pull",
    exercises: [
      { name: "Tirage horizontal", muscles: "Dos", weight: "20–40 kg", series: "3", reps: "10", rest: "60–90 sec" },
      { name: "Tirage vertical (traction assistée)", muscles: "Dos, biceps", weight: "30–50 kg", series: "3", reps: "10", rest: "60–90 sec" },
      { name: "Curl haltères", muscles: "Biceps", weight: "6–10 kg", series: "3", reps: "12", rest: "60–90 sec" },
      { name: "Oiseau avec haltères", muscles: "Épaules (arrière)", weight: "4–8 kg", series: "3", reps: "12", rest: "60–90 sec" },
      { name: "Planche", muscles: "Abdos", weight: "30–60 sec", series: "3", reps: "1", rest: "30 sec" }
    ]
  },
  {
    day: "Vendredi",
    type: "Full body léger / Mobilité",
    exercises: [
      { name: "Kettlebell swings", muscles: "Full body", weight: "8–12 kg", series: "3", reps: "15", rest: "60–90 sec" },
      { name: "Squats poids du corps", muscles: "Jambes", weight: "Poids du corps", series: "3", reps: "20", rest: "60–90 sec" },
      { name: "Pompes sur les genoux", muscles: "Poitrine, triceps", weight: "Poids du corps", series: "3", reps: "12", rest: "60–90 sec" },
      { name: "Bird-dog", muscles: "Gainage", weight: "Poids du corps", series: "3", reps: "10 (par côté)", rest: "30 sec" },
      { name: "Étirements dynamiques", muscles: "Mobilité", weight: "5–10 min", series: "1", reps: "1", rest: "-" }
    ]
  },
  {
    day: "Samedi",
    type: "Cardio ou libre"
  },
  {
    day: "Dimanche",
    type: "Repos complet"
  }
];

const savedWeights = JSON.parse(localStorage.getItem('savedWeights')) || {};

function saveWeight(day, exerciseName, field, value) {
  if (!savedWeights[day]) savedWeights[day] = {};
  if (!savedWeights[day][exerciseName]) savedWeights[day][exerciseName] = {};
  savedWeights[day][exerciseName][field] = value;
  localStorage.setItem('savedWeights', JSON.stringify(savedWeights));
}

const tabsDiv = document.getElementById('tabs');
const contentDiv = document.getElementById('content');
let activeDayIndex = 0;

function renderTabs() {
  tabsDiv.innerHTML = '';
  program.forEach((p, i) => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (i === activeDayIndex ? ' active' : '');
    tab.textContent = p.day;
    tab.title = p.type;
    tab.addEventListener('click', () => {
      activeDayIndex = i;
      renderTabs();
      renderContent();
    });
    tabsDiv.appendChild(tab);
  });
}

function createInput(value, callback) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'weight-input';
  input.value = value;
  input.addEventListener('input', () => callback(input.value));
  return input;
}

function renderContent() {
  contentDiv.innerHTML = '';
  const dayProg = program[activeDayIndex];

  const h2 = document.createElement('h2');
  h2.textContent = `${dayProg.day} - ${dayProg.type}`;
  contentDiv.appendChild(h2);

  if (!dayProg.exercises) {
    const p = document.createElement('p');
    p.textContent = "Aucun exercice prévu pour aujourd’hui.";
    contentDiv.appendChild(p);
    return;
  }

  dayProg.exercises.forEach(ex => {
    const saved = (savedWeights[dayProg.day] && savedWeights[dayProg.day][ex.name]) || {};

    const card = document.createElement('div');
    card.className = 'exercise-card';

    const nameDiv = document.createElement('div');
    nameDiv.innerHTML = `<label>Exercice :</label> ${ex.name}`;
    card.appendChild(nameDiv);

    const musclesDiv = document.createElement('div');
    musclesDiv.innerHTML = `<label>Muscles :</label> ${ex.muscles}`;
    card.appendChild(musclesDiv);

    const weightDiv = document.createElement('div');
    const weightLabel = document.createElement('label');
    weightLabel.textContent = "Poids / Durée :";
    weightDiv.appendChild(weightLabel);
    weightDiv.appendChild(createInput(saved.weight || ex.weight, val => saveWeight(dayProg.day, ex.name, 'weight', val)));
    card.appendChild(weightDiv);

    const seriesDiv = document.createElement('div');
    const seriesLabel = document.createElement('label');
    seriesLabel.textContent = "Séries :";
    seriesDiv.appendChild(seriesLabel);
    seriesDiv.appendChild(createInput(saved.series || ex.series, val => saveWeight(dayProg.day, ex.name, 'series', val)));
    card.appendChild(seriesDiv);

    const repsDiv = document.createElement('div');
    const repsLabel = document.createElement('label');
    repsLabel.textContent = "Répétitions :";
    repsDiv.appendChild(repsLabel);
    repsDiv.appendChild(createInput(saved.reps || ex.reps, val => saveWeight(dayProg.day, ex.name, 'reps', val)));
    card.appendChild(repsDiv);

    const restDiv = document.createElement('div');
    restDiv.innerHTML = `<label>Repos :</label> ${ex.rest || "-"}`;
    card.appendChild(restDiv);

    contentDiv.appendChild(card);
  });
}

renderTabs();
renderContent();

const themeSwitch = document.getElementById('theme-switch');

// Appliquer thème selon préférence enregistrée
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeSwitch.checked = true;
}

// Écoute du switch
themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});
