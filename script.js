function HillyRoad () {
  let roadAngleCounter = 0;

  const road = {
    currentRoadAngle: 0,
    updateRoadAngle: function () {
      this.currentRoadAngle = Math.sin(roadAngleCounter) * 20;
      roadAngleCounter += Math.PI * 2 / 1000;
    },
    tick: function () {
      // this represents the road's angle changing as we drive along it
      this.updateRoadAngle();
    },
    toString: function () {
      let output = "";
      output += "<h2>ROAD</h2>";
      output += "<p>road angle: " + this.currentRoadAngle.toFixed(1) + "</p>";
      return output;
    },
  };

  return road;
};

function Car () {
  const initialSpeed = 60;
  const targetSpeed = 70;

  const car = {
    currentSpeed: initialSpeed,
    targetSpeed: targetSpeed,
    tick: function () {
      // no internal changes produced in this simple model
    },
    toString: function () {
      let output = "";
      output += "<h2>CAR</h2>";
      output += "<p>current speed: " + this.currentSpeed.toFixed(1) + "</p>";
      output += "<p>target speed: " + this.targetSpeed.toFixed(1) + "</p>";
      return output;
    },
  };

  return car;
};

function FuzzyController (road, car) {
  const ROAD_ANGLE_LOWER_BOUND = -15.0;
  const ROAD_ANGLE_UPPER_BOUND = 15.0;
  const roadAngleStates = {
    DOWNHILL: 1,
    FLAT: 2,
    UPHILL: 3,
    properties: {
      1: { 
        membership: function (angle) {
          if (angle < ROAD_ANGLE_LOWER_BOUND) return 1;
          if (angle < 0) return angle / ROAD_ANGLE_LOWER_BOUND;
          return 0;
        },
        name: "downhill"
      },
      2: { 
        membership: function (angle) {
          if (angle > ROAD_ANGLE_LOWER_BOUND && angle < ROAD_ANGLE_UPPER_BOUND)
            return (ROAD_ANGLE_UPPER_BOUND - Math.abs(angle)) / ROAD_ANGLE_UPPER_BOUND;
          return 0;
        },
        name: "flat"
      },
      3: { 
        membership: function (angle) {
          if (angle > ROAD_ANGLE_UPPER_BOUND) return 1;
          if (angle > 0) return angle / ROAD_ANGLE_UPPER_BOUND;
          return 0;
        },
        name: "uphill"
      },
    },
  };

  const RELATIVE_SPEED_LOWER_BOUND = -5.0;
  const RELATIVE_SPEED_UPPER_BOUND = 5.0;
  const relativeSpeedStates = {
    UNDER: 1,
    MATCHED: 2,
    OVER: 3,
    properties: {
      1: {
        membership: function (speed) {
          if (speed < RELATIVE_SPEED_LOWER_BOUND) return 1;
          if (speed < 0) return speed / RELATIVE_SPEED_LOWER_BOUND;
          return 0;
        },
        name: "under"
      },
      2: {
        membership: function (speed) {
          if (speed > RELATIVE_SPEED_LOWER_BOUND && speed < RELATIVE_SPEED_UPPER_BOUND)
            return (RELATIVE_SPEED_UPPER_BOUND - Math.abs(speed)) / RELATIVE_SPEED_UPPER_BOUND;
          return 0;
        },
        name: "matched"
      },
      3: {
        membership: function (speed) {
          if (speed > RELATIVE_SPEED_UPPER_BOUND) return 1;
          if (speed > 0) return speed / RELATIVE_SPEED_UPPER_BOUND;
          return 0;
        },
        name: "over"
      },
    },
  };

  const carActionStates = {
    BRAKE_HARD: 1,
    BRAKE_SOFT: 2,
    MAINTAIN: 3,
    ACCELERATE_SOFT: 4,
    ACCELERATE_HARD: 5,
    properties: {
      1: {
        name: "braking hard",
        estimateOutput: function (antecedentStrength) {
          const maxBrakeImpact = 0.2;
          const moderatedMax = maxBrakeImpact * antecedentStrength;
          const pivot = Math.min(0.08, moderatedMax);
          const cutoff = 0.04;
          return (moderatedMax > cutoff) ? -(moderatedMax + (pivot - cutoff) / 2) : 0;
        },
      },
      2: {
        name: "braking soft",
        estimateOutput: function (antecedentStrength) {
          const maxBrakeImpact = 0.8;
          const moderatedMax = maxBrakeImpact * antecedentStrength;
          const pivot = Math.min(0.04, moderatedMax);
          const cutoff = 0.00;
          return -(moderatedMax + (pivot - cutoff) / 2);
        },
      },
      3: {
        name: "maintain",
        estimateOutput: function (antecedentStrength) {
          return 0;
        },
      },
      4: {
        name: "accelerating soft",
        estimateOutput: function (antecedentStrength) {
          const maxAccelerationImpact = 0.8;
          const moderatedMax = maxAccelerationImpact * antecedentStrength;
          const pivot = Math.min(0.04, moderatedMax);
          const cutoff = 0.00;
          return moderatedMax + (pivot - cutoff) / 2;
        },
      },
      5: {
        name: "accelerating hard",
        estimateOutput: function (antecedentStrength) {
          const maxAccelerationImpact = 0.2;
          const moderatedMax = maxAccelerationImpact * antecedentStrength;
          const pivot = Math.min(0.08, moderatedMax);
          const cutoff = 0.04;
          return (moderatedMax > cutoff) ? moderatedMax + (pivot - cutoff) / 2 : 0;
        },
      },
    },
  };

  const rules = [
    {
      roadAngleState: roadAngleStates.DOWNHILL,
      relativeSpeedState : relativeSpeedStates.OVER,
      carActionState: carActionStates.BRAKE_HARD,
    },
    {
      roadAngleState: roadAngleStates.FLAT,
      relativeSpeedState : relativeSpeedStates.OVER,
      carActionState: carActionStates.BRAKE_SOFT,
    },
    {
      roadAngleState: roadAngleStates.DOWNHILL,
      relativeSpeedState : relativeSpeedStates.MATCHED,
      carActionState: carActionStates.BRAKE_SOFT,
    },
    {
      roadAngleState: roadAngleStates.UPHILL,
      relativeSpeedState : relativeSpeedStates.OVER,
      carActionState: carActionStates.MAINTAIN,
    },
    {
      roadAngleState: roadAngleStates.FLAT,
      relativeSpeedState : relativeSpeedStates.MATCHED,
      carActionState: carActionStates.MAINTAIN,
    },
    {
      roadAngleState: roadAngleStates.DOWNHILL,
      relativeSpeedState : relativeSpeedStates.UNDER,
      carActionState: carActionStates.MAINTAIN,
    },
    {
      roadAngleState: roadAngleStates.UPHILL,
      relativeSpeedState : relativeSpeedStates.MATCHED,
      carActionState: carActionStates.ACCELERATE_SOFT,
    },
    {
      roadAngleState: roadAngleStates.FLAT,
      relativeSpeedState : relativeSpeedStates.UNDER,
      carActionState: carActionStates.ACCELERATE_SOFT,
    },
    {
      roadAngleState: roadAngleStates.UPHILL,
      relativeSpeedState : relativeSpeedStates.UNDER,
      carActionState: carActionStates.BRAKE_HARD,
    },
  ];

  const controller = {
    currentRoadAngleStates: {},
    currentRelativeSpeedStates: {},
    currentCarActionStates: {},
    calculateRelativeSpeed: function (car) {
      return car.currentSpeed - car.targetSpeed;
    },
    tick: function () {
      road.tick();
      car.tick();

      // fuzzification
      const angle = road.currentRoadAngle;
      [roadAngleStates.DOWNHILL, roadAngleStates.FLAT, roadAngleStates.UPHILL].forEach(function (state) {
        this.currentRoadAngleStates[state] = roadAngleStates.properties[state].membership(angle);
      }, this);

      const speed = this.calculateRelativeSpeed(car);
      [relativeSpeedStates.UNDER, relativeSpeedStates.MATCHED, relativeSpeedStates.OVER].forEach(function (state) {
          this.currentRelativeSpeedStates[state] = relativeSpeedStates.properties[state].membership(speed);
      }, this);

      // reset our car action states so we can recalculate them summatively
      [carActionStates.BRAKE_HARD, carActionStates.BRAKE_SOFT, carActionStates.MAINTAIN, carActionStates.ACCELERATE_SOFT, carActionStates.ACCELERATE_HARD].forEach(function (state) {
        this.currentCarActionStates[state] = 0;
      }, this);

      // use rules to compute output, using product t norm
      rules.forEach(function (rule) {
        const antecedentStrength = this.currentRoadAngleStates[rule.roadAngleState] * this.currentRelativeSpeedStates[rule.relativeSpeedState];

        // defuzzify
        this.currentCarActionStates[rule.carActionState] += carActionStates.properties[rule.carActionState].estimateOutput(antecedentStrength);
      }, this);

      // apply defuzzified values to car speed
      [carActionStates.BRAKE_HARD, carActionStates.BRAKE_SOFT, carActionStates.MAINTAIN, carActionStates.ACCELERATE_SOFT, carActionStates.ACCELERATE_HARD].forEach(function (state) {
        car.currentSpeed += this.currentCarActionStates[state];
      }, this);
    },
    toString: function () {
      let output = "";
      output += "<h2>FUZZY CONTROLLER</h2>";
      output += "<h4>road angle set membership:</h4>";
      output += "<ul>";
      [roadAngleStates.DOWNHILL, roadAngleStates.FLAT, roadAngleStates.UPHILL].forEach(function (state) {
        output += "<li>" + roadAngleStates.properties[state].name + ": " + this.currentRoadAngleStates[state].toFixed(1) + "</li>";
      }, this);
      output += "</ul>";

      output += "<h4>relative speed set membership:</h4>";
      output += "<ul>";
      [relativeSpeedStates.UNDER, relativeSpeedStates.MATCHED, relativeSpeedStates.OVER].forEach(function (state) {
        output += "<li>" + relativeSpeedStates.properties[state].name + ": " + this.currentRelativeSpeedStates[state].toFixed(1) + "</li>";
      }, this);
      output += "</ul>";

      output += "<h4>car action output:</h4>";
      output += "<ul>";
      [carActionStates.BRAKE_HARD, carActionStates.BRAKE_SOFT, carActionStates.MAINTAIN, carActionStates.ACCELERATE_SOFT, carActionStates.ACCELERATE_HARD].forEach(function (state) {
        output += "<li>" + carActionStates.properties[state].name + ": " + this.currentCarActionStates[state].toFixed(1) + "</li>";
      }, this);
      output += "</ul>";

      return output
    },
  };

  return controller;
};

function Simulator () {
  const FRAME_SPEED_IN_MS = 50;

  const road = HillyRoad();
  const car = Car();
  const controller = FuzzyController(road, car);

  const simulator = {
    start: function () {
      const element = document.getElementById('simulation');

      const simulationFrame = function () {
        controller.tick();
        element.innerHTML = road.toString() + car.toString() + controller.toString();
      };

      const intervalId = setInterval(simulationFrame, FRAME_SPEED_IN_MS);

      setTimeout(function () {
        clearInterval(intervalId);
      }, 60000);
    },
  };

  return simulator;
};

function go () {
  var s = new Simulator();
  s.start();
}
