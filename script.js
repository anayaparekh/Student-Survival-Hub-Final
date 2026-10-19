
// STUDENT SURVIVAL HUB: INTERACTIVE FEATURES

// Feature 1: Switch between light mode and dark mode.
const themeButton = document.getElementById("theme-toggle");

if (themeButton) {
  themeButton.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark-mode");
    themeButton.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

// Feature 2: Display a new motivational message on the home page.
const motivationButton = document.getElementById("motivation-button");
const motivationText = document.getElementById("motivation-text");

const motivationalMessages = [
  "Small steps every day lead to big progress.",
  "You can learn difficult things one step at a time.",
  "Progress matters more than perfection.",
  "Start where you are and do what you can today.",
  "Every assignment you finish is a step forward."
];

if (motivationButton && motivationText) {
  motivationButton.addEventListener("click", function () {
    const randomIndex = Math.floor(
      Math.random() * motivationalMessages.length
    );
    motivationText.textContent = motivationalMessages[randomIndex];
  });
}

// Feature 3: Reveal a random study tip on the Study Tips page.
const tipButton = document.getElementById("tip-button");
const extraTip = document.getElementById("extra-tip");

const extraTips = [
  "Teach the topic to someone else. Explaining it helps you notice what you understand.",
  "Review notes a little at a time instead of trying to learn everything at once.",
  "Mix practice questions with reviewing notes to check what you really know.",
  "Put your phone away during a focus session to reduce distractions.",
  "Write down questions you still have and ask your teacher for clarification."
];

if (tipButton && extraTip) {
  tipButton.addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * extraTips.length);
    extraTip.textContent = extraTips[randomIndex];
  });
}

// Feature 4: Add, complete, and delete homework assignments.
const homeworkForm = document.getElementById("homework-form");
const assignmentList = document.getElementById("assignment-list");
const assignmentCount = document.getElementById("assignment-count");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

let assignments = [];

function updateHomeworkProgress() {
  if (!assignmentList) return;

  const completedCount = assignments.filter(
    assignment => assignment.completed
  ).length;

  const totalCount = assignments.length;

  assignmentCount.textContent =
    totalCount + (totalCount === 1 ? " task" : " tasks");

  const percentage = totalCount === 0
    ? 0
    : (completedCount / totalCount) * 100;

  progressFill.style.width = percentage + "%";

  if (totalCount === 0) {
    progressText.textContent = "Add an assignment to get started.";
  } else {
    progressText.textContent =
      completedCount + " of " + totalCount +
      " assignments completed (" + Math.round(percentage) + "%).";
  }
}

function renderAssignments() {
  if (!assignmentList) return;

  assignmentList.replaceChildren();

  if (assignments.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "✨ You're ready to get organized! Add your first assignment.";
    assignmentList.appendChild(emptyMessage);
    updateHomeworkProgress();
    return;
  }

  assignments.forEach(function (assignment) {
    const item = document.createElement("li");
    item.className = "assignment-item";

    if (assignment.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = assignment.completed;
    checkbox.setAttribute(
      "aria-label",
      "Mark " + assignment.name + " as completed"
    );

    checkbox.addEventListener("change", function () {
      assignment.completed = checkbox.checked;
      renderAssignments();
    });

    const details = document.createElement("div");
    details.className = "assignment-details";

    const title = document.createElement("div");
    title.className = "assignment-title";
    title.textContent = assignment.name;

    const meta = document.createElement("div");
    meta.className = "assignment-meta";

    const readableDate = new Date(
      assignment.dueDate + "T12:00:00"
    ).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    meta.textContent = assignment.subject + " · Due " + readableDate;

    details.append(title, meta);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      "Delete " + assignment.name
    );

    deleteButton.addEventListener("click", function () {
      assignments = assignments.filter(
        item => item.id !== assignment.id
      );
      renderAssignments();
    });

    item.append(checkbox, details, deleteButton);
    assignmentList.appendChild(item);
  });

  updateHomeworkProgress();
}

if (homeworkForm) {
  // Prevent selecting a past date for a new assignment.
  const dueDateInput = document.getElementById("due-date");
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  dueDateInput.min = localToday;

  homeworkForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("assignment-name").value.trim();
    const subject = document.getElementById("subject").value;
    const dueDate = dueDateInput.value;

    if (!name || !subject || !dueDate) {
      alert("Please complete all assignment fields.");
      return;
    }

    assignments.push({
      id: Date.now() + Math.random(),
      name: name,
      subject: subject,
      dueDate: dueDate,
      completed: false
    });

    renderAssignments();
    homeworkForm.reset();
    dueDateInput.min = localToday;
  });

  renderAssignments();
}
