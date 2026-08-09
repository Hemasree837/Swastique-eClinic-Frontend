import { useState } from "react";
import "./HealthCalculators.css";

export default function HealthCalculators() {
  const [activeTab, setActiveTab] = useState("bmi");

  // BMI State
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  // Water Intake State
  const [userWeight, setUserWeight] = useState(65);

  const calculateBmi = () => {
    if (!height || !weight) return { bmi: 0, status: "N/A" };
    const hMeter = height / 100;
    const bmiVal = (weight / (hMeter * hMeter)).toFixed(1);
    let status = "Normal Weight";
    let color = "#10b981";

    if (bmiVal < 18.5) {
      status = "Underweight";
      color = "#38bdf8";
    } else if (bmiVal >= 25 && bmiVal < 29.9) {
      status = "Overweight";
      color = "#f59e0b";
    } else if (bmiVal >= 30) {
      status = "Obese";
      color = "#ef4444";
    }

    return { bmi: bmiVal, status, color };
  };

  const calculateWaterIntake = () => {
    const liters = (userWeight * 0.035).toFixed(1);
    const glasses = Math.round(liters * 4);
    return { liters, glasses };
  };

  const bmiResult = calculateBmi();
  const waterResult = calculateWaterIntake();

  return (
    <div className="health-calc-card glass-card">
      <div className="calc-header">
        <span className="calc-badge">🧮 Interactive Health Tools</span>
        <h2>Personalized Health Calculators</h2>
        <p>Estimate your Body Mass Index (BMI) and daily hydration target instantly.</p>
      </div>

      <div className="calc-tabs">
        <button
          className={`calc-tab-btn ${activeTab === "bmi" ? "active" : ""}`}
          onClick={() => setActiveTab("bmi")}
        >
          ⚖️ BMI Calculator
        </button>
        <button
          className={`calc-tab-btn ${activeTab === "water" ? "active" : ""}`}
          onClick={() => setActiveTab("water")}
        >
          💧 Daily Water Intake
        </button>
      </div>

      {activeTab === "bmi" && (
        <div className="calc-body-grid">
          <div className="calc-inputs-col">
            <div className="slider-group">
              <div className="slider-label-row">
                <span>Weight (kg):</span>
                <strong>{weight} kg</strong>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-label-row">
                <span>Height (cm):</span>
                <strong>{height} cm</strong>
              </div>
              <input
                type="range"
                min="100"
                max="220"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="calc-result-box">
            <span className="res-title">Your Estimated BMI</span>
            <span className="res-big-value" style={{ color: bmiResult.color }}>
              {bmiResult.bmi}
            </span>
            <span className="res-status-badge" style={{ backgroundColor: `${bmiResult.color}20`, color: bmiResult.color }}>
              {bmiResult.status}
            </span>
          </div>
        </div>
      )}

      {activeTab === "water" && (
        <div className="calc-body-grid">
          <div className="calc-inputs-col">
            <div className="slider-group">
              <div className="slider-label-row">
                <span>Your Body Weight (kg):</span>
                <strong>{userWeight} kg</strong>
              </div>
              <input
                type="range"
                min="30"
                max="130"
                value={userWeight}
                onChange={(e) => setUserWeight(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="calc-result-box">
            <span className="res-title">Recommended Daily Water</span>
            <span className="res-big-value" style={{ color: "#0284c7" }}>
              {waterResult.liters} Liters
            </span>
            <span className="res-status-badge" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
              🥤 ~{waterResult.glasses} Glasses / Day
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
