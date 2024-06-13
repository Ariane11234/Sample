// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-fcx-VZCyxcGRYB_Ciw3Imy5Jk91QmFw",
  authDomain: "micro-sample-16208.firebaseapp.com",
  databaseURL: "https://micro-sample-16208-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "micro-sample-16208",
  storageBucket: "micro-sample-16208.appspot.com",
  messagingSenderId: "1063844022843",
  appId: "1:1063844022843:web:c4617e2cca5215b83b6a1e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Firebase database reference
var database = firebase.database();

// Function to update HTML elements
function updateElement(id, value) {
  document.getElementById(id).textContent = value;
}

// Function to update circular progress elements
function updateCircularProgress(element, value) {
  const radius = element.querySelector('.circular-progress').r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  element.querySelector('.circular-progress').style.strokeDashoffset = offset;
  element.querySelector('.progress-value').textContent = value + '%';
}

// Fetch temperature data from Firebase
database.ref('sensors/temperature').on('value', (snapshot) => {
  const tempValue = snapshot.val();
  updateElement('TemperatureValue', tempValue);

  // Update Highcharts
  const time = new Date().getTime();
  chartTemperature.series[0].addPoint([time, tempValue], true, true);
});

// Fetch humidity data from Firebase
database.ref('sensors/humidity').on('value', (snapshot) => {
  const humidValue = snapshot.val();
  updateElement('humidvalue', humidValue);
  updateCircularProgress(document.querySelector('.circular-progress1'), humidValue);

  // Update Highcharts
  const time = new Date().getTime();
  chartHumidity.series[0].addPoint([time, humidValue], true, true);
});

// Fetch pH level data from Firebase
database.ref('sensors/ph').on('value', (snapshot) => {
  const phValue = snapshot.val();
  updateElement('phvalue', phValue);
  document.querySelector('.progress__fill').style.width = phValue + '%';
  document.querySelector('.progress__text').textContent = phValue + '%';

  // Update Highcharts
  const time = new Date().getTime();
  chartPhLevel.series[0].addPoint([time, phValue], true, true);
});

// Fetch dissolved oxygen data from Firebase
database.ref('sensors/oxygen').on('value', (snapshot) => {
  const oxygenValue = snapshot.val();
  updateElement('oxygenvalue', oxygenValue);
  updateCircularProgress(document.querySelector('.circular-progress'), oxygenValue);

  // Update Highcharts
  const time = new Date().getTime();
  chartDissoxy.series[0].addPoint([time, oxygenValue], true, true);
});

// Highcharts configuration for temperature
var chartTemperature = Highcharts.chart('chart-temperature', {
  chart: { type: 'line' },
  title: { text: 'Temperature Data' },
  xAxis: { type: 'datetime' },
  yAxis: { title: { text: 'Temperature (°C)' } },
  series: [{ name: 'Temperature', data: [] }]
});

// Highcharts configuration for humidity
var chartHumidity = Highcharts.chart('chart-humidity', {
  chart: { type: 'line' },
  title: { text: 'Humidity Data' },
  xAxis: { type: 'datetime' },
  yAxis: { title: { text: 'Humidity (%)' } },
  series: [{ name: 'Humidity', data: [] }]
});

// Highcharts configuration for dissolved oxygen
var chartDissoxy = Highcharts.chart('chart-dissoxy', {
  chart: { type: 'line' },
  title: { text: 'Dissolved Oxygen Data' },
  xAxis: { type: 'datetime' },
  yAxis: { title: { text: 'Dissolved Oxygen (mg/L)' } },
  series: [{ name: 'Dissolved Oxygen', data: [] }]
});

// Highcharts configuration for pH level
var chartPhLevel = Highcharts.chart('chart-phLevel', {
  chart: { type: 'line' },
  title: { text: 'pH Level Data' },
  xAxis: { type: 'datetime' },
  yAxis: { title: { text: 'pH Level' } },
  series: [{ name: 'pH Level', data: [] }]
});

// Function to update charts with data from Firebase
function updateChart(chart, path) {
  database.ref(path).on('value', (snapshot) => {
    const data = snapshot.val();
    const seriesData = [];
    for (let key in data) {
      seriesData.push([parseInt(key), data[key]]);
    }
    chart.series[0].setData(seriesData);
  });
}

// Update charts with initial data from Firebase
updateChart(chartTemperature, 'sensors/temperature');
updateChart(chartHumidity, 'sensors/humidity');
updateChart(chartDissoxy, 'sensors/oxygen');
updateChart(chartPhLevel, 'sensors/ph');

// Toggle button for dropdown menu
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');

toggleBtn.onclick = function() {
  dropDownMenu.classList.toggle('open');
  const isOpen = dropDownMenu.classList.contains('open');
  toggleBtnIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
};
