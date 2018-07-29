// TODO: implement fuzzy sets, implications, defuzzification
// TODO: prettify display
// TODO: let user pick some input and start

function HillyRoad () {
  let angleCounter = 0;

  const road = {
    currentAngle: 0,
    updateAngle: function () {
      this.currentAngle = Math.sin(angleCounter) * 15;
      angleCounter += Math.PI * 2 / 1000;
    },
    tick: function () {
      this.updateAngle();
    },
    toString: function () {
      let output = "";
      output += "<p>road angle: " + this.currentAngle + "</p>";
      return output;
    },
  };

  return road;
};

function Car () {
  const initialSpeed = 60000;
  const targetSpeed = 70000;

  const states = {
    NO_ACTION: 1,
    ACCELERATING_SOFT: 2,
    ACCELERATING_HARD: 3,
    BRAKING_SOFT: 4,
    BRAKING_HARD: 5,
    properties: {
      1: { speedImpact: 0, name: "maintain" },
      2: { speedImpact: 30, name: "accelerating soft" },
      3: { speedImpact: 50, name: "accelerating hard" },
      4: { speedImpact: -30, name: "braking soft" },
      5: { speedImpact: -50, name: "braking hard" },
    },
  };

  const car = {
    currentSpeed: initialSpeed,
    targetSpeed: targetSpeed,
    currentState: states.NO_ACTION,
    maintainSpeed: function () {
      this.currentState = states.NO_ACTION;
    },
    accelerateSoft: function () {
      this.currentState = states.ACCELERATING_SOFT;
    },
    accelerateHard: function () {
      this.currentState = states.ACCELERATING_HARD;
    },
    brakeSoft: function () {
      this.currentState = states.BRAKING_SOFT;
    },
    brakeHard: function () {
      this.currentState = states.BRAKING_HARD;
    },
    tick: function () {
      this.currentSpeed += states.properties[this.currentState].speedImpact;
    },
    toString: function () {
      let output = "";
      output += "<p>current action: " + states.properties[this.currentState].name + "</p>";
      output += "<p>current speed: " + this.currentSpeed / 1000 + "</p>";
      output += "<p>target speed: " + this.targetSpeed / 1000 + "</p>";
      return output;
    },
  };

  return car;
};

function FuzzyController (road, car) {
  const relativeSpeedStates = {
    UNDER: 1,
    MATCHED: 2,
    OVER: 3,
    properties: {
      1: { value: "TODO", name: "under" },
      2: { value: "TODO", name: "matched" },
      3: { value: "TODO", name: "over" },
    },
  };

  const angleStates = {
    FLAT: 1,
    UPHILL: 2,
    DOWNHILL: 3,
    properties: {
      1: { value: "TODO", name: "flat" },
      2: { value: "TODO", name: "uphill" },
      3: { value: "TODO", name: "downhill" },
    },
  };

  const controller = {
    currentRelativeSpeedState: null,
    currentAngleState: null,
    calculateRelativeSpeed: function () {
    },
    tick: function () {
      road.tick();
      car.tick();
      // TODO: fuzzy control here
      // calculate output from our inputs (speed difference, road angle) and update car state
    },
    toString: function () {
      let output = "";
      output += "<p>relative speed set membership: " + relativeSpeedStates.properties[this.currentRelativeSpeedState].name + "</p>";
      output += "<p>angle set membership: " + angleStates.properties[this.currentAngleState].name + "</p>";
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
        element.innerHTML = road.toString() + car.toString() // TODO + controller.toString();
      };

      const intervalId = setInterval(simulationFrame, FRAME_SPEED_IN_MS);

      setTimeout(function () {
        clearInterval(intervalId);
      }, 30000);
    },
  };

  return simulator;
};
