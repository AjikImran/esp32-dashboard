// Your Firebase config (replace with your actual values)
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Reference to the sensor data
const sensorRef = db.ref("/sensorReadings/current");

// Listen for real-time updates
sensorRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  document.getElementById("temperature").innerText = `${data.sensorData.temperature} °C`;
  document.getElementById("humidity").innerText = `${data.sensorData.humidity} %`;
  document.getElementById("co2").innerText = `${data.sensorData.co2} ppm`;
  document.getElementById("lux").innerText = `${data.sensorData.lux} lux`;
  document.getElementById("water").innerText = `${data.sensorData.waterLevelPercent} %`;

  document.getElementById("humidifier").innerText = data.deviceStatus.humidifier ? "ON" : "OFF";
  document.getElementById("blower").innerText = data.deviceStatus.blower ? "ON" : "OFF";
  document.getElementById("light").innerText = data.deviceStatus.light ? "ON" : "OFF";
  document.getElementById("exhaust").innerText = data.deviceStatus.exhaust ? "ON" : "OFF";
});

