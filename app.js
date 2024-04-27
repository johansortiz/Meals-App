// Variables globales
const API_URL = 'https://www.themealdb.com/api/json/v1/1';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchOptions = document.getElementById('search-options');
const resultsGallery = document.getElementById('results-gallery');
const mealInfo = document.getElementById('meal-info');

// Búsqueda
searchButton.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    const searchType = searchOptions.value;
    
// Para campo vacío
    if (!searchQuery) {
        alert('Por favor, ingrese dato.');
        return;
    }

// búsqueda según el tipo 
    if (searchType === 'name') {
        searchByMealName(searchQuery);
    } else {
        searchByOtherCriteria(searchQuery, searchType);
    }
});

// por nombre del plato
function searchByMealName(query) {
    const url = `${API_URL}/search.php?s=${query}`;
    const resultsGallery = document.getElementById('results-gallery')

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                showMealInfo(data.meals[0]);
                resultsGallery.innerHTML = '';
            } else {
                alert(`No se encontró ningún plato con el nombre "${query}"`);
            }
        })
        .catch(error => {
            console.error('Error en la búsqueda por nombre del plato:', error);
        });
}

// Búsqueda por ingrediente, categoría o área
function searchByOtherCriteria(query, type) {
    let url = '';

    // Configurar la URL según el tipo de búsqueda
    switch (type) {
        case 'ingredient':
            url = `${API_URL}/filter.php?i=${query}`;
            break;
        case 'category':
            url = `${API_URL}/filter.php?c=${query}`;
            break;
        case 'area':
            url = `${API_URL}/filter.php?a=${query}`;
            break;
        default:
            return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                // Mostrar tarjetas
                showResultsGallery(data.meals);
            } else {
                alert(`No se encontraron platos para ${type} con el nombre "${query}".`);
            }
        })
        .catch(error => {
            console.error(`Error en la búsqueda por ${type}:`, error);
        });
}

// información del plato
function showMealInfo(meal) {
   
    mealInfo.innerHTML = '';

    // Crear elementos para mostrar la información del plato
    const mealName = document.createElement('h2');
    mealName.textContent = meal.strMeal;

    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;

    //  ingredientes
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredientes:';
    
    const ingredientsList = document.createElement('ul');
    const ingredients = getMealIngredients(meal);

    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    //  instrucciones
    const instructionsTitle = document.createElement('h3');
    instructionsTitle.textContent = 'Instrucciones:';
    
    const instructions = document.createElement('p');
    instructions.textContent = meal.strInstructions;

    // Agregar elementos a la sección de información
    mealInfo.appendChild(mealName);
    mealInfo.appendChild(mealImage);
    mealInfo.appendChild(ingredientsTitle);
    mealInfo.appendChild(ingredientsList);
    mealInfo.appendChild(instructionsTitle);
    mealInfo.appendChild(instructions);
}

//  lista de ingredientes del plato
function getMealIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient} - ${measure}`);
        }
    }

    return ingredients;
}


function showResultsGallery(meals) {
    // 18 platos como máximo
    const limitedMeals = meals.slice(0, 18);

    // Limpiar la galería de resultados
    resultsGallery.innerHTML = '';

    // tarjetas para cada plato
    limitedMeals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'card';
        
        //imagen del plato
        const img = document.createElement('img');
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;

        // nombre del plato
        const mealName = document.createElement('p');
        mealName.textContent = meal.strMeal;

        // Agregar evento de clic para mostrar la información del plato
        card.addEventListener('click', () => {
            searchByMealName(meal.strMeal);
        });

        // Agregar elementos a la tarjeta
        card.appendChild(img);
        card.appendChild(mealName);

        // Agregar la tarjeta a la galería de resultados
        resultsGallery.appendChild(card);
    });
}
