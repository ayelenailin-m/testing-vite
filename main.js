//import './style.css'


// Función para obtener todas las tareas
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

// Función para mostrar las tareas en el HTML
function displayTasks(tasks) {
  const tasksDiv = document.getElementById('tasks');
  tasksDiv.innerHTML = tasks.map(task => `
      <div>
          <h2>${task.title}</h2>
          <p>${task.description}</p>
          <p>Estado: ${task.isComplete ? 'Completo' : 'Incompleto'}</p>
      </div>
  `).join('');
}

// Llama a la función para obtener y mostrar las tareas al cargar la página
fetchTasks();


