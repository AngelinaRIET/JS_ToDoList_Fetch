/*
 * L'objectif de l'exercice est de se connecter à un serveur à distance (ce qu'on
 * appelle une API) en HTTP GET, et de récupérer une liste d'utilisateurs et une 
 * liste de tâches qui leur sont attribuées.
 * Ces données sont dans un format brut, en JSON. Il faut donc construire 
 * l'affichage final HTML en se basant sur ces données, dans la balise <ul> : chaque
 * entrée dans la liste représente une tâche, avec les informations sur la tâche et
 * sur l'utilisateur qui doit effectuer la tâche en question.
 * 
 * La documentation pour se connecter au serveur à distance :
 * https://jsonplaceholder.typicode.com/
 * Se servir de l'exemple de la documentation pour tester l'API et comprendre ce qu'elle renvoie.
 */

// ---- VARIABLES ET CONSTANTES GLOBALES

let users;      // Le tableau des utilisateurs


// ---- FONCTIONS

function refresh(taskList)  // taskList = les données JSON, grâce au 2ème httpResponse.json() tout en bas
{
    // Recherche de la balise <ul> dans le DOM.
    const ul = document.getElementById('todo-list');

    // Au départ la liste est vide.
    ul.innerHTML = null;

    for(let index = 0; index < 12; index++)
    {
        // Récupération d'une tâche dans la liste fournie.
        const task = taskList[index];

        // Recherche d'un utilisateur en fonction de l'id de l'utilisateur à qui la tâche est attribuée.
        const user = searchUser(task.userId);
        // C'est comme s'il y avait en SQL deux tables USER et TASK, avec une colonne userId et qu'on faisait un INNER JOIN.

        let completed;

        if(task.completed == true)
        {
            completed = 'Oui';
        }
        else
        {
            completed = 'Non';
        }

        // Ajout d'une entrée dans la liste.
        ul.innerHTML += `
            <li class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${user.name}, ${user.email}</p>
                    <p class="card-text">Terminé ? ${completed}</p>
                </div>
            </li>`;
    }
}

function searchUser(userId)
{
    // Recherche d'un utilisateur dans le tableau "users" en fonction de son id
    for(const user of users)
    {
        // Est-ce que l'utilisateur (son id) correspond à celui demandé ?
        if(user.id == userId)
        {
            // Oui, retourne l'utilisateur trouvé.
            return user;
        }
    }

    // Non, aucun utilisateur trouvé.
    return null;
}



// ---- CODE PRINCIPAL

// Au départ il n'y a pas d'utilisateurs connus.
users = [];

// Utilisation de window.fetch() pour effectuer des requêtes HTTP.
// https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch


window.fetch('https://jsonplaceholder.typicode.com/users')
    // Première fonction : s'occupe d'analyser la réponse HTTP (gestion des erreurs etc.)
    .then(function(httpResponse)
    {
        // Demande à récupérer les données de la réponse HTTP en JSON.
        return httpResponse.json();
    })
    // Deuxième fonction : s'occupe de traiter les données de la réponse HTTP
    .then(function(results) // results = les données JSON, grâce au httpResponse.json() ci-dessus
    {
        // Enregistrement de la liste des utilisateurs.
        users = results;

        window.fetch('https://jsonplaceholder.typicode.com/todos')
            .then(function(httpResponse)
            {
                // Demande à récupérer les données de la réponse HTTP en JSON.
                return httpResponse.json();
            })
            .then(refresh); // Appel direct d'une fonction refresh() qui va s'occuper de l'affichage
    });