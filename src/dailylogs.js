import React, { useState } from "react";
import "/home/jdave1125/Weightr/src/dailylogs.css";

function DailyLogForm() {
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      weight,
      calories,
    };

    try {
      const response = await fetch("http://localhost:3001/daily-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Data saved successfully");
        setWeight("");
        setCalories("");
      } else {
        console.error("Error while saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='daily-log-form'>
      <h2>Daily Log</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='weight'>Weight (lbs):</label>
          <input
            type='number'
            id='weight'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='calories'>Calories:</label>
          <input
            type='number'
            id='calories'
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default DailyLogForm;
