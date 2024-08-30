import './style.css';

async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    if (!response.ok) throw new Error('No hay respuesta');
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error('Hubo un problema al obtener su petición:', error);
  }
}

function displayTasks(tasks) {
  const tasksDiv = document.getElementById('tasks');
  tasksDiv.innerHTML = tasks.map(task => `
      <div>
          <div class="info">
            <h2>${task.title}</h2>
            <p>${task.description}</p>
            <p>Estado: ${task.isComplete ? 'Completo' : 'Incompleto'}</p>
          </div>
          <div class="buttonTasks">
            <button class="updateTaskButton" data-id="${task.id}">Actualizar</button>
            <button class="deleteTaskButton" data-id="${task.id}">Eliminar</button>
          </div>
      </div>
  `).join('');

  // Event listeners para actualizar y eliminar tareas
  document.querySelectorAll('.updateTaskButton').forEach(button => {
    button.addEventListener('click', handleUpdateTask);
  });

  document.querySelectorAll('.deleteTaskButton').forEach(button => {
    button.addEventListener('click', handleDeleteTask);
  });
}

function showTaskForm(task = {}) {
  const formPopup = document.getElementById('taskFormPopup');
  formPopup.style.display = 'block';
  
  document.getElementById('taskId').value = task.id || '';
  document.getElementById('title').value = task.title || '';
  document.getElementById('description').value = task.description || '';
  document.getElementById('isComplete').checked = task.isComplete || false;
  document.getElementById('formTitle').innerText = task.id ? 'Actualizar Tarea' : 'Crear Tarea';
}

document.getElementById('cancelButton').addEventListener('click', () => {
  document.getElementById('taskFormPopup').style.display = 'none';
});

document.getElementById('taskForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const id = document.getElementById('taskId').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const isComplete = document.getElementById('isComplete').checked;

  if (id) {
    await handleSaveTask(id, title, description, isComplete);
  } else {
    await handleCreateTask(title, description, isComplete);
  }

  document.getElementById('taskFormPopup').style.display = 'none';
  fetchTasks();
});

async function handleCreateTask(title, description, isComplete) {
  try {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, isComplete })
    });
    if (!response.ok) throw new Error('Error al crear la tarea');
  } catch (error) {
    console.error('Hubo un problema al crear la tarea:', error);
  }
}

async function handleSaveTask(id, title, description, isComplete) {
  try {
    const response = await fetch(`http://localhost:3000/task/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, isComplete })
    });
    if (!response.ok) throw new Error('Error al actualizar la tarea');
  } catch (error) {
    console.error('Hubo un problema al actualizar la tarea:', error);
  }
}

async function handleDeleteTask(event) {
  const taskId = event.target.getAttribute('data-id');

  try {
    const response = await fetch(`http://localhost:3000/task/${taskId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar la tarea');
    alert('Tarea eliminada');
    fetchTasks();
  } catch (error) {
    console.error('Hubo un problema al eliminar la tarea:', error);
  }
}

document.getElementById('createTaskButton').addEventListener('click', () => {
  showTaskForm();
});
/*
async function handleUpdateTask(event) {
  const taskId = event.target.getAttribute('data-id');
  const task = await fetch(`http://localhost:3000/task/${taskId}`).then(res => res.json());
  showTaskForm(task[0]);
}*/
async function handleUpdateTask(event) {
  const taskId = event.target.getAttribute('data-id');
  try {
    // Obtener la tarea específica desde la API
    const response = await fetch(`http://localhost:3000/task/${taskId}`);
    if (!response.ok) throw new Error('Error al obtener la tarea');
    const task = await response.json();
    
    // Mostrar el formulario con los datos de la tarea
    showTaskForm(task);
  } catch (error) {
    console.error('Hubo un problema al obtener la tarea:', error);
  }
}


fetchTasks();
