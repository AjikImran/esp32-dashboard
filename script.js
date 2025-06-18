// Replace with your actual Firebase API key
const firebaseConfig = {
  apiKey: "AIzaSyDEozwWzO2_zZP4fEc2Rt71GbCCRXuJDNU",
  authDomain: "mushroomfarm-15e97.firebaseapp.com",
  databaseURL: "https://mushroomfarm-15e97-default-rtdb.firebaseio.com",
  projectId: "mushroomfarm-15e97",
  storageBucket: "mushroomfarm-15e97.firebasestorage.app",
  messagingSenderId: "934146779029",
  appId: "1:934146779029:web:d9c5268f9b3ce41ea7389c",
  measurementId: "G-5RRYQTP6T2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const labels = [];
const tempData = [];
const humidData = [];
const co2Data = [];

const chart = new Chart(document.getElementById("envChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempData,
        borderColor: "blue",
        backgroundColor: "transparent",
        tension: 0.3
      },
      {
        label: "Humidity (%)",
        data: humidData,
        borderColor: "green",
        backgroundColor: "transparent",
        tension: 0.3
      },
      {
        label: "CO₂ (ppm)",
        data: co2Data,
        borderColor: "orange",
        backgroundColor: "transparent",
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: false }
    }
  }
});

function setLED(id, isOn) {
  const led = document.getElementById(id + "-led");
  led.className = "status-led " + (isOn ? "on" : "off");
}

function loadData() {
  db.ref("sensorReadings/current").once("value").then(snapshot => {
    const data = snapshot.val();
    if (!data) return;

    const s = data.sensorData;
    const d = data.deviceStatus;

    document.getElementById("temp").textContent = s.temperature?.toFixed(1) ?? "--";
    document.getElementById("humidity").textContent = s.humidity?.toFixed(1) ?? "--";
    document.getElementById("co2").textContent = s.co2 ?? "--";
    document.getElementById("lux").textContent = s.lux?.toFixed(1) ?? "--";
    document.getElementById("water").textContent = s.waterLevelPercent?.toFixed(1) ?? "--";

    setLED("humidifier", d.humidifier);
    setLED("blower", d.blower);
    setLED("light", d.light);
    setLED("exhaust", d.exhaust);

    const timeLabel = new Date(data.timestamp * 1000).toLocaleTimeString();
    if (labels.length >= 10) {
      labels.shift(); tempData.shift(); humidData.shift(); co2Data.shift();
    }
    labels.push(timeLabel);
    tempData.push(s.temperature);
    humidData.push(s.humidity);
    co2Data.push(s.co2);
    chart.update();
  });

  db.ref("alerts/waterLevel").once("value").then(snapshot => {
    const msg = snapshot.val() || "No alert";
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = msg;
    alertBox.classList.remove("alert-ok", "alert-warning");

    if (msg.toLowerCase().includes("low")) {
      alertBox.classList.add("alert-warning");
    } else {
      alertBox.classList.add("alert-ok");
    }
  });
}

loadData();
setInterval(loadData, 10000);
