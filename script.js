// DARK / LIGHT MODE
const toggleBtn = document.querySelector(".toggle-btn");

window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("mode");
  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  } else {
    if (toggleBtn) toggleBtn.textContent = "🌙";
  }
});

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("mode", "dark");
      toggleBtn.textContent = "☀️";
    } else {
      localStorage.setItem("mode", "light");
      toggleBtn.textContent = "🌙";
    }
  });
}

// MANAGE HABITS PAGE
const addHabitBtn = document.getElementById("addHabitBtn");
const habitModal = document.getElementById("habitModal");
const saveHabitBtn = document.getElementById("saveHabitBtn");
const cancelHabitBtn = document.getElementById("cancelHabitBtn");
const habitContainer = document.getElementById("habitContainer");

const habitNameInput = document.getElementById("habitName");
const habitDescInput = document.getElementById("habitDesc");
const habitGoalInput = document.getElementById("habitGoal");
const habitProgressInput = document.getElementById("habitProgress");
const formTitle = document.getElementById("formTitle");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let editId = null;

// Open modal
if (addHabitBtn) {
  addHabitBtn.addEventListener("click", () => {
    habitModal.style.display = "flex";
    formTitle.textContent = "Add Habit";
    habitNameInput.value = "";
    habitDescInput.value = "";
    habitGoalInput.value = "";
    habitProgressInput.value = "";
    editId = null;
  });
}

// Cancel modal
if (cancelHabitBtn) {
  cancelHabitBtn.addEventListener("click", () => {
    habitModal.style.display = "none";
  });
}

// Save habit
if (saveHabitBtn) {
  saveHabitBtn.addEventListener("click", () => {
    const name = habitNameInput.value.trim();
    const desc = habitDescInput.value.trim();
    const goal = parseInt(habitGoalInput.value);
    const progress = parseInt(habitProgressInput.value);

    if (!name || !desc || isNaN(goal) || isNaN(progress)) {
      alert("Please fill all fields correctly!");
      return;
    }

    if (editId !== null) {
      habits = habits.map((h) =>
        h.id === editId ? { ...h, name, desc, goal, progress } : h
      );
    } else {
      habits.push({
        id: Date.now(),
        name,
        desc,
        goal,
        progress,
        date: new Date().toLocaleDateString(),
      });
    }

    localStorage.setItem("habits", JSON.stringify(habits));
    habitModal.style.display = "none";
    showHabits();
  });
}

// Render habits (manage page only)
function showHabits() {
  if (!habitContainer) return;

  habitContainer.innerHTML = "";

  if (habits.length === 0) {
    habitContainer.innerHTML = "<p>No habits added yet.</p>";
    return;
  }

  habits.forEach((h) => {
    const percent = Math.min((h.progress / h.goal) * 100, 100);

    const card = document.createElement("div");
    card.className = "habit-card";

    card.innerHTML = `
      <div class="habit-info">
        <h3>${h.name}</h3>
        <span>${h.date}</span>
      </div>
      <p>${h.desc}</p>
      <div class="progress-bar">
        <div class="progress" style="width:${percent}%">
          ${h.progress}/${h.goal}
        </div>
      </div>
      <div class="habit-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const editBtn = card.querySelector(".edit-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
      habitModal.style.display = "flex";
      formTitle.textContent = "Edit Habit";
      habitNameInput.value = h.name;
      habitDescInput.value = h.desc;
      habitGoalInput.value = h.goal;
      habitProgressInput.value = h.progress;
      editId = h.id;
    });

    deleteBtn.addEventListener("click", () => {
      if (confirm("Delete this habit?")) {
        habits = habits.filter((item) => item.id !== h.id);
        localStorage.setItem("habits", JSON.stringify(habits));
        showHabits();
      }
    });

    habitContainer.appendChild(card);
  });
}

// Initial render on manage page
if (habitContainer) {
  showHabits();
}

// DASHBOARD LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const totalHabitsEl = document.getElementById("totalHabits");
  const completedHabitsEl = document.getElementById("completedHabits");
  const completedTodayEl = document.getElementById("completedToday");
  const motivationEl = document.getElementById("motivationText");
  const habitsGrid = document.querySelector(".habits-grid");

  if (!totalHabitsEl || !habitsGrid) return;

  const habits = JSON.parse(localStorage.getItem("habits")) || [];

  // STATS
  totalHabitsEl.textContent = habits.length;
  completedHabitsEl.textContent = habits.filter(
    (h) => h.progress >= h.goal
  ).length;
  completedTodayEl.textContent = habits.filter((h) => h.progress > 0).length;

  // DAILY MOTIVATION
  const motivations = [
    "Consistency beats motivation",
    "Small steps every day",
    "Progress over perfection",
    "One habit at a time",
    "Your future self will thank you",
    "Discipline creates freedom",
    "Show up daily",
    "Tiny habits matter",
    "Momentum builds success",
    "Trust the process",
    "Habits shape identity",
    "Stay consistent",
    "Daily effort wins",
    "You are improving",
    "Be patient with progress",
    "Focus on the process",
    "Action builds confidence",
    "Keep going",
    "Success is routine",
    "Consistency is power",
  ];

  const todayKey = new Date().toDateString();
  let dailyMotivation = JSON.parse(localStorage.getItem("dailyMotivation"));

  if (!dailyMotivation || dailyMotivation.date !== todayKey) {
    dailyMotivation = {
      date: todayKey,
      text: motivations[Math.floor(Math.random() * motivations.length)],
    };
    localStorage.setItem("dailyMotivation", JSON.stringify(dailyMotivation));
  }

  motivationEl.textContent = dailyMotivation.text;

  // LATEST HABITS
  habitsGrid.innerHTML = "";

  if (habits.length === 0) {
    habitsGrid.innerHTML = "<p>No habits yet.</p>";
    return;
  }

  habits
    .slice(-8)
    .reverse()
    .forEach((h) => {
      const percent = Math.min((h.progress / h.goal) * 100, 100);

      const card = document.createElement("div");
      card.className = "habit-card";

      card.innerHTML = `
      <div class="habit-info">
        <h3>${h.name}</h3>
        <span>${h.date}</span>
      </div>
      <p>${h.desc}</p>
      <div class="progress-bar">
        <div class="progress" style="width:${percent}%"></div>
        <div class="progress-text">${h.progress}/${h.goal}</div>
      </div>
      <button class="done-btn">Done</button>
    `;

      const doneBtn = card.querySelector(".done-btn");
      const progressText = card.querySelector(".progress-text");
      const progressBar = card.querySelector(".progress");

      // Disable button if already complete
      if (h.progress >= h.goal) {
        doneBtn.textContent = "Complete";
        doneBtn.disabled = true;
        doneBtn.style.backgroundColor = "gray";
        doneBtn.style.cursor = "not-allowed";
      }

      doneBtn.addEventListener("click", () => {
        if (h.progress < h.goal) {
          h.progress += 1;
          localStorage.setItem("habits", JSON.stringify(habits));

          // Update UI instantly
          progressText.textContent = `${h.progress}/${h.goal}`;
          progressBar.style.width = `${Math.min(
            (h.progress / h.goal) * 100,
            100
          )}%`;

          if (h.progress >= h.goal) {
            doneBtn.textContent = "Complete";
            doneBtn.disabled = true;
            doneBtn.style.backgroundColor = "gray";
            doneBtn.style.cursor = "not-allowed";
          }
        }
      });

      habitsGrid.appendChild(card);
    });
});
