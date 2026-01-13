
// вручную сколько заданий выполнено:
const completedTasks = 2;  // менять только это число

// количество заданий:
const TOTAL_TASKS = 5;


// элементы

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressSteps = document.querySelectorAll(".progress-steps span");


//   обновление прогресса

function updateProgress() {
    const percent = Math.round((completedTasks / TOTAL_TASKS) * 100);

    progressFill.style.width = percent + "%";
    progressFill.parentElement.dataset.percent = percent + "%";

    progressText.textContent = `Выполнено: ${completedTasks} из ${TOTAL_TASKS}`;

    progressSteps.forEach((step, index) => {
        step.classList.toggle("active", index < completedTasks);
    });
}

updateProgress();
