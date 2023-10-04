# Weightr
CRUD app that helps the user track calories and weight over time to help them get a sense of their metabolism.


app flow: 
-User interacts with the form in DailyLogForm and submits a daily log.
-The log data is sent to the backend API for storage.
-If the API request is successful, the onLogSubmit callback in App.js is called to update the weeklyLogs state with the new log data.
-App.js re-renders with the updated weeklyLogs, and the new log is displayed in the Week component if the week is not full.
-If the week is full, the averages are calculated and displayed.
