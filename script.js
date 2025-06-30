window.onload = function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDEozwWzO2_zZP4fEc2Rt71GbCCRXuJDNU",
    authDomain: "mushroomfarm-15e97.firebaseapp.com",
    databaseURL: "https://mushroomfarm-15e97-default-rtdb.firebaseio.com",
    projectId: "mushroomfarm-15e97",
    storageBucket: "mushroomfarm-15e97.appspot.com",
    messagingSenderId: "934146779029",
    appId: "1:934146779029:web:d9c5268f9b3ce41ea7389c"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const labels = [];
  const tempData = [], humidData = [], co2Data = [], luxData = [];

  const tempHumChart = new Chart(document.getElementById("tempHumChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: tempData,
          borderColor: "blue",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Humidity (%)",
          data: humidData,
          borderColor: "green",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const co2Chart = new Chart(document.getElementById("co2Chart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "CO₂ (ppm)",
        data: co2Data,
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const luxChart = new Chart(document.getElementById("luxChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Light (lux)",
        data: luxData,
        borderColor: "purple",
        backgroundColor: "rgba(153, 102, 255, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  function setLED(id, isOn) {
    const led = document.getElementById(id + "-led");
    led.className = "status-led " + (isOn ? "on" : "off");
  }

  window.loadData = function () {
    db.ref("sensorReadings/current").once("value").then(snapshot => {
      const data = snapshot.val();
      if (!data || !data.sensorData) return;

      const s = data.sensorData;
      const d = data.deviceStatus || {};
      const timeLabel = new Date(data.timestamp * 1000).toLocaleTimeString();

      document.getElementById("temp").textContent = s.temperature?.toFixed(1) ?? "--";
      document.getElementById("humidity").textContent = s.humidity?.toFixed(1) ?? "--";
      document.getElementById("co2").textContent = s.co2 ?? "--";
      document.getElementById("lux").textContent = s.lux?.toFixed(1) ?? "--";
      document.getElementById("water").textContent = s.waterLevelPercent?.toFixed(1) ?? "--";

      setLED("humidifier", d.humidifier);
      setLED("blower", d.blower);
      setLED("light", d.light);
      setLED("exhaust", d.exhaust);

      if (labels.length >= 10) {
        labels.shift(); tempData.shift(); humidData.shift(); co2Data.shift(); luxData.shift();
      }

      labels.push(timeLabel);
      if (typeof s.temperature === 'number') tempData.push(s.temperature);
      if (typeof s.humidity === 'number') humidData.push(s.humidity);
      if (typeof s.co2 === 'number') co2Data.push(s.co2);
      if (typeof s.lux === 'number') luxData.push(s.lux);

      tempHumChart.update();
      co2Chart.update();
      luxChart.update();
    });

    db.ref("alerts/waterLevel").once("value").then(snapshot => {
      const msg = snapshot.val() || "No alert";
      const box = document.getElementById("alert-box");
      box.textContent = msg;
      box.className = "alert-box " + (msg.toLowerCase().includes("low") ? "alert-warning" : "alert-ok");
    });
  };

  // Initial and periodic refresh
  loadData();
  setInterval(loadData, 10000);
};
