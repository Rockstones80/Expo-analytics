// IoT Water System Data Simulator
// This simulator creates realistic data for water systems monitoring
// including clog detection, flowrate, and water pressure

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const { randomUUID } = require('crypto');

const app = express();

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuration for the simulated sensors
const sensorConfig = {
  updateInterval: 1000, // ms between updates
  sensors: {
    clogDetection: {
      normalRange: [5, 30], // cm - distance to potential clog (lower = more clogged)
      warningThreshold: 10, // cm - when to start warning
      criticalThreshold: 5, // cm - when to alert
      variability: 0.5, // How much random noise to add
      driftFactor: 0.05, // How quickly sensor drifts toward clog
      simulateClog: true, // Whether to simulate clogs periodically
      clogInterval: 120, // How often to simulate clogs (in seconds)
      clogDuration: 30, // How long clogs last (in seconds)
    },
    flowRate: {
      normalRange: [20, 40], // L/min
      warningThresholdLow: 15, // L/min
      criticalThresholdLow: 5, // L/min
      warningThresholdHigh: 45, // L/min
      criticalThresholdHigh: 55, // L/min
      variability: 1.5, // Random noise
      simulateFlowIssues: true, // Whether to simulate flow issues
      issueInterval: 180, // How often to simulate issues (in seconds)
      issueDuration: 45, // How long issues last (in seconds)
    },
    waterPressure: {
      normalRange: [40, 60], // PSI
      warningThresholdLow: 30, // PSI
      criticalThresholdLow: 20, // PSI
      warningThresholdHigh: 70, // PSI
      criticalThresholdHigh: 80, // PSI
      variability: 2, // Random noise
      simulatePressureIssues: true, // Whether to simulate pressure issues
      issueInterval: 240, // How often to simulate pressure issues (in seconds)
      issueDuration: 60, // How long issues last (in seconds)
    }
  }
};

// Initial sensor values (start in normal range)
const sensorState = {
  clogDetection: {
    value: (sensorConfig.sensors.clogDetection.normalRange[0] + sensorConfig.sensors.clogDetection.normalRange[1]) / 2,
    status: 'normal',
    trend: 'everchanging',
    lastUpdate: Date.now(),
    inSimulatedEvent: false,
    eventStartTime: null
  },
  flowRate: {
    value: (sensorConfig.sensors.flowRate.normalRange[0] + sensorConfig.sensors.flowRate.normalRange[1]) / 2,
    status: 'normal',
    trend: 'stable',
    lastUpdate: Date.now(),
    inSimulatedEvent: false,
    eventStartTime: null
  },
  waterPressure: {
    value: (sensorConfig.sensors.waterPressure.normalRange[0] + sensorConfig.sensors.waterPressure.normalRange[1]) / 2,
    status: 'normal',
    trend: 'stable',
    lastUpdate: Date.now(),
    inSimulatedEvent: false,
    eventStartTime: null
  }
};

// Helper function for random values
function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Update clog detection values
function updateClogDetection() {
  const sensor = sensorState.clogDetection;
  const sensorSettings = sensorConfig.sensors.clogDetection;
  const now = Date.now();
  
  // Check if we should start or end a simulated clog event
  if (sensorSettings.simulateClog) {
    if (!sensor.inSimulatedEvent && Math.random() < 1 / (sensorSettings.clogInterval * (1000 / sensorSettings.updateInterval))) {
      // Start a new clog event
      sensor.inSimulatedEvent = true;
      sensor.eventStartTime = now;
      sensor.trend = 'decreasing';
      console.log('Simulating clog event');
    } else if (sensor.inSimulatedEvent && (now - sensor.eventStartTime) > sensorSettings.clogDuration * 1000) {
      // End the clog event
      sensor.inSimulatedEvent = false;
      sensor.trend = 'increasing';
      console.log('Ending clog event');
    }
  }

// Update the sensor value based on the current state
  if (sensor.inSimulatedEvent) {
    // During a clog event, gradually decrease the value (distance gets smaller as clog forms)
    sensor.value = Math.max(
      sensorSettings.normalRange[0] / 2,
      sensor.value - (sensorSettings.driftFactor * 2) - getRandomInRange(0, sensorSettings.variability)
    );
  } else if (sensor.value < ((sensorSettings.normalRange[0] + sensorSettings.normalRange[1]) / 2)) {
    // If below the middle of normal range, drift upward (clog clearing)
    sensor.value = Math.min(
      sensorSettings.normalRange[1],
      sensor.value + sensorSettings.driftFactor + getRandomInRange(-sensorSettings.variability/2, sensorSettings.variability)
    );
  } else {
    // Otherwise add some random drift within normal range
    sensor.value += getRandomInRange(-sensorSettings.variability, sensorSettings.variability);
    sensor.value = Math.max(sensorSettings.normalRange[0], Math.min(sensorSettings.normalRange[1], sensor.value));
  }

  // Update status based on current value
  if (sensor.value <= sensorSettings.criticalThreshold) {
    sensor.status = 'critical';
  } else if (sensor.value <= sensorSettings.warningThreshold) {
    sensor.status = 'warning';
  } else {
    sensor.status = 'normal';
  }

  // Update trend
  sensor.lastUpdate = now;
}

// Update flow rate values
function updateFlowRate() {
  const sensor = sensorState.flowRate;
  const sensorSettings = sensorConfig.sensors.flowRate;
  const now = Date.now();
  
  // Check if we should start or end a simulated flow issue
  if (sensorSettings.simulateFlowIssues) {
    if (!sensor.inSimulatedEvent && Math.random() < 1 / (sensorSettings.issueInterval * (1000 / sensorSettings.updateInterval))) {
      // Start a new flow issue (can be either high or low)
      sensor.inSimulatedEvent = true;
      sensor.eventStartTime = now;
      // 50% chance of high flow, 50% chance of low flow issue
      sensor.trend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
      console.log(`Simulating ${sensor.trend} flow issue`);
    } else if (sensor.inSimulatedEvent && (now - sensor.eventStartTime) > sensorSettings.issueDuration * 1000) {
      // End the flow issue
      sensor.inSimulatedEvent = false;
      sensor.trend = sensor.trend === 'increasing' ? 'decreasing' : 'increasing';
      console.log('Ending flow issue');
    }
  }

  // Update the sensor value based on the current state
  if (sensor.inSimulatedEvent) {
    if (sensor.trend === 'increasing') {
      // Flow increasing (could reach critical high)
      sensor.value = Math.min(
        sensorSettings.criticalThresholdHigh * 1.2,
        sensor.value + sensorSettings.variability * 2 + getRandomInRange(0, sensorSettings.variability)
      );
    } else {
      // Flow decreasing (could reach critical low)
      sensor.value = Math.max(
        sensorSettings.criticalThresholdLow * 0.5,
        sensor.value - sensorSettings.variability * 2 - getRandomInRange(0, sensorSettings.variability)
      );
    }
  } else {
    // Normal operation with random variation
    const midpoint = (sensorSettings.normalRange[0] + sensorSettings.normalRange[1]) / 2;
    if (Math.abs(sensor.value - midpoint) > (sensorSettings.normalRange[1] - sensorSettings.normalRange[0]) / 3) {
      // If we're far from the middle, drift back toward normal
      sensor.value += (sensor.value < midpoint) ? 
        sensorSettings.variability + getRandomInRange(0, sensorSettings.variability/2) : 
        -sensorSettings.variability + getRandomInRange(-sensorSettings.variability/2, 0);
    } else {
      // Otherwise just add some noise
      sensor.value += getRandomInRange(-sensorSettings.variability, sensorSettings.variability);
    }
  }

// Update status based on current value
  if (sensor.value <= sensorSettings.criticalThresholdLow) {
    sensor.status = 'critical-low';
  } else if (sensor.value <= sensorSettings.warningThresholdLow) {
    sensor.status = 'warning-low';
  } else if (sensor.value >= sensorSettings.criticalThresholdHigh) {
    sensor.status = 'critical-high';
  } else if (sensor.value >= sensorSettings.warningThresholdHigh) {
    sensor.status = 'warning-high';
  } else {
    sensor.status = 'normal';
  }

  // Update trend
  sensor.lastUpdate = now;
}

// Update water pressure values
function updateWaterPressure() {
  const sensor = sensorState.waterPressure;
  const sensorSettings = sensorConfig.sensors.waterPressure;
  const now = Date.now();
  
  // Check if we should start or end a simulated pressure issue
  if (sensorSettings.simulatePressureIssues) {
    if (!sensor.inSimulatedEvent && Math.random() < 1 / (sensorSettings.issueInterval * (1000 / sensorSettings.updateInterval))) {
      // Start a new pressure issue (can be either high or low)
      sensor.inSimulatedEvent = true;
      sensor.eventStartTime = now;
      // 50% chance of high pressure, 50% chance of low pressure issue
      sensor.trend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
      console.log(`Simulating ${sensor.trend} pressure issue`);
    } else if (sensor.inSimulatedEvent && (now - sensor.eventStartTime) > sensorSettings.issueDuration * 1000) {
      // End the pressure issue
      sensor.inSimulatedEvent = false;
      sensor.trend = sensor.trend === 'increasing' ? 'decreasing' : 'increasing';
      console.log('Ending pressure issue');
    }
  }

  // Update the sensor value based on the current state
  if (sensor.inSimulatedEvent) {
    if (sensor.trend === 'increasing') {
      // Pressure increasing (could reach critical high)
      sensor.value = Math.min(
        sensorSettings.criticalThresholdHigh * 1.2,
        sensor.value + sensorSettings.variability * 2 + getRandomInRange(0, sensorSettings.variability)
      );
    } else {
      // Pressure decreasing (could reach critical low)
      sensor.value = Math.max(
        sensorSettings.criticalThresholdLow * 0.5,
        sensor.value - sensorSettings.variability * 2 - getRandomInRange(0, sensorSettings.variability)
      );
    }
  } else {
    // Normal operation with random variation
    const midpoint = (sensorSettings.normalRange[0] + sensorSettings.normalRange[1]) / 2;
    if (Math.abs(sensor.value - midpoint) > (sensorSettings.normalRange[1] - sensorSettings.normalRange[0]) / 3) {
      // If we're far from the middle, drift back toward normal
      sensor.value += (sensor.value < midpoint) ? 
        sensorSettings.variability + getRandomInRange(0, sensorSettings.variability/2) : 
        -sensorSettings.variability + getRandomInRange(-sensorSettings.variability/2, 0);
    } else {
      // Otherwise just add some noise
      sensor.value += getRandomInRange(-sensorSettings.variability, sensorSettings.variability);
    }
  }

  // Update status based on current value
  if (sensor.value <= sensorSettings.criticalThresholdLow) {
    sensor.status = 'critical-low';
  } else if (sensor.value <= sensorSettings.warningThresholdLow) {
    sensor.status = 'warning-low';
  } else if (sensor.value >= sensorSettings.criticalThresholdHigh) {
    sensor.status = 'critical-high';
  } else if (sensor.value >= sensorSettings.warningThresholdHigh) {
    sensor.status = 'warning-high';
  } else {
    sensor.status = 'normal';
  }

  // Update trend
  sensor.lastUpdate = now;
}

// Update all sensors
function updateAllSensors() {
  updateClogDetection();
  updateFlowRate();
  updateWaterPressure();
  
  // Add timestamps and format data for client
  const data = {
    timestamp: new Date().toISOString(),
    sensors: {
      clogDetection: {
        value: parseFloat(sensorState.clogDetection.value.toFixed(2)),
        unit: 'cm',
        status: sensorState.clogDetection.status,
        trend: sensorState.clogDetection.trend
      },
      flowRate: {
        value: parseFloat(sensorState.flowRate.value.toFixed(2)),
        unit: 'L/min',
        status: sensorState.flowRate.status,
        trend: sensorState.flowRate.trend
      },
      waterPressure: {
        value: parseFloat(sensorState.waterPressure.value.toFixed(2)),
        unit: 'kPa',
        status: sensorState.waterPressure.status,
        trend: sensorState.waterPressure.trend
      }
    }
  };
  
  // Emit the data via socket.io
  io.emit('sensorUpdate', data);
  

    // axios.get('https://famous-cricket-655.convex.cloud')
    // .then(response => {
    //     console.log(response.data); // Print the response data
    // })
    // .catch(error => {
    //     console.error('Error:', error.message); // Handle errors
    // });

  // Log critical events
  Object.entries(data.sensors).forEach(([key, sensor]) => {
    if (sensor.status.includes('critical')) {
      console.log(`ALERT: ${key} is in ${sensor.status} state with value ${sensor.value} ${sensor.unit}`);
    }
  });
}

// API routes for REST access
app.get('/', (req, res) => {
  res.send('IoT Water System Data Simulator API is running');
});

app.get('/api/sensors', (req, res) => {

const clogDetectiontimestamp = new Date(sensorState.clogDetection.lastUpdate).toLocaleTimeString();
const flowRatetimestamp = new Date(sensorState.flowRate.lastUpdate).toLocaleTimeString();
const waterPressuretimestamp = new Date(sensorState.waterPressure.lastUpdate).toLocaleTimeString();


//todo: find a way to store the timestamp in the data object
//todo: find a way to store the data and map them to each time stamp
//todo: find a way to represent the data in a graph

const data = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    sensors: {
        clogDetection: {
        value: parseFloat(sensorState.clogDetection.value.toFixed(2)),
        unit: 'cm',
        status: sensorState.clogDetection.status,
        trend: sensorState.clogDetection.trend,
        time: clogDetectiontimestamp
        },
        flowRate: {
        value: parseFloat(sensorState.flowRate.value.toFixed(2)),
        unit: 'L/min',
        status: sensorState.flowRate.status,
        trend: sensorState.flowRate.trend,
        time: flowRatetimestamp
        },
        waterPressure: {
        value: parseFloat(sensorState.waterPressure.value.toFixed(2)),
        unit: 'kPa',
        status: sensorState.waterPressure.status,
        trend: sensorState.waterPressure.trend,
        time: waterPressuretimestamp
        }
    }
};
res.json(data);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send immediate update to new clients
  const data = {
    timestamp: new Date().toISOString(),
    sensors: {
      clogDetection: {
        value: parseFloat(sensorState.clogDetection.value.toFixed(2)),
        unit: 'cm',
        status: sensorState.clogDetection.status,
        trend: sensorState.clogDetection.trend
      },
      flowRate: {
        value: parseFloat(sensorState.flowRate.value.toFixed(2)),
        unit: 'L/min',
        status: sensorState.flowRate.status,
        trend: sensorState.flowRate.trend
      },
      waterPressure: {
        value: parseFloat(sensorState.waterPressure.value.toFixed(2)),
        unit: 'kPa',
        status: sensorState.waterPressure.status,
        trend: sensorState.waterPressure.trend
      }
    }
  };
  socket.emit('sensorUpdate', data);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the update interval
const updateInterval = setInterval(updateAllSensors, sensorConfig.updateInterval);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`IoT Water System Data Simulator running on port ${PORT}`);
  console.log(`REST endpoint: http://localhost:${PORT}/api/sensors`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
});

// Clean up on exit
process.on('SIGINT', () => {
  clearInterval(updateInterval);
  server.close(() => {
    console.log('Server shutting down');
    process.exit(0);
  });
});