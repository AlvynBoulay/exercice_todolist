let todos = [];

const form = document.querySelector('form');
const input = document.querySelector('input[name="title"]');
const todoList = document.querySelector('.list-group');

// Ajoute une nouvelle tâche
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Créer un objet tâche
    const newTodo = {
        id: Date.now(),
        title: input.value,
        done: false 
    };

    // Ajouter la tâche au tableau
    todos.push(newTodo);

    // Effacer l'input
    input.value = '';

    // MAJ de l'affichage
    updateDisplay();

    // Sauvegarde dans localStorage après l'ajout
    SavedToLocalStorage();
});

// Met à jour l'affichage de la liste de tâches
function updateDisplay() {
    todoList.innerHTML = ''; // Vider la liste

    // Filtrer les tâches en fonction du filtre actuel
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'all') {
            return true; // Affiche toutes les taches
        } else if (currentFilter === 'todo') {
            return !todo.done; // Affiche les taches non faites
        } else if (currentFilter === 'done') {
            return todo.done; // Affiche les taches faites
        }
    });

    // Ajouter chaque tâche filtrée à la liste
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('todo', 'list-group-item', 'd-flex', 'align-items-center', 'justify-content-between', 'mb-2');
        if (todo.done) {
            li.classList.add('text-decoration-line-through');
        }

        // Créer la checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input');
        checkbox.checked = todo.done;

        // Gérer le changement de statut de la tâche
        checkbox.addEventListener('change', () => {
            todo.done = checkbox.checked;
            updateDisplay();
            SavedToLocalStorage(); // Sauvegarde après modification du statut
        });

        // Créer le label de la tâche
        const label = document.createElement('label');
        label.classList.add('form-check-label', 'ms-2');
        label.textContent = todo.title;

        // Bouton de suppression
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteBtn.innerHTML = '<i class="bi-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== todo.id); // Supprimer la tâche
            updateDisplay();
            SavedToLocalStorage(); // Sauvegarde après suppression
        });

        // Ajouter les éléments au <li>
        const formCheck = document.createElement('div');
        formCheck.classList.add('form-check');
        formCheck.appendChild(checkbox);
        formCheck.appendChild(label);
        li.appendChild(formCheck);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Ajout des filtres
const filterButtons = document.querySelectorAll('[data-filter]');
let currentFilter = 'all';

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active'); 
        currentFilter = button.getAttribute('data-filter'); 
        updateDisplay(); 
    });
});

// Chargement des tâches avec fetch()
fetch('todos.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des tâches');
        }
        return response.json();
    })
    .then(data => {
        todos = data;
        updateDisplay();
    })
    .catch(error => {
        console.error('Erreur fetch :', error)
    });

// Charger le LocalStorage si disponible
const savedTodos = localStorage.getItem('todos');
if (savedTodos) {
    todos = JSON.parse(savedTodos);
    updateDisplay();
}

// Fonction pour sauvegarder les tâches dans localStorage
function SavedToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
