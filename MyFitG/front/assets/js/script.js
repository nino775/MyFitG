'use strict';

// ---------- Add Event On Element
const addEventOnElement = function (elem, type, callback) {
    if (!elem) {
        console.error("No element found to attach event.");
        return;
    }

    // If elem is a NodeList (or array-like), add event listener to each element
    if (NodeList.prototype.isPrototypeOf(elem) || HTMLCollection.prototype.isPrototypeOf(elem)) {
        elem.forEach(el => el.addEventListener(type, callback));
    } else {
        // If elem is a single element, attach event listener directly
        elem.addEventListener(type, callback);
    }
};

// ---------- Navbar Toggle
const navbar = document.querySelector('[data-navbar]');
const navTogglers = document.querySelectorAll('[data-nav-toggler]');
const navLinks = document.querySelectorAll('[data-nav-link]');

const toggleNavbar = function () {
    navbar.classList.toggle('active');
};

addEventOnElement(navTogglers, 'click', toggleNavbar);

const closeNavbar = function () {
    navbar.classList.remove('active');
};

addEventOnElement(navLinks, 'click', closeNavbar);

// ---------- Header and Back Top Button Active
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
    if (window.scrollY) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
    } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});

// ---------- Back Button Confirmation
const backButton = document.querySelector(".back-button");
if (backButton) {
    backButton.addEventListener("click", function (event) {
        const confirmBack = confirm("Are you sure you want to go back to the homepage?");
        if (!confirmBack) {
            event.preventDefault(); // Prevents navigation if the user clicks "Cancel"
        }
    });
}

// ---------- Join Form Submission
const joinForm = document.getElementById("joinForm");
if (joinForm) {
    joinForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get values from the form
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const age = document.getElementById("age").value;
        const email = document.getElementById("email").value;
       

        // Display the values in an alert (or send them to a server here)
        alert(`Thank you, ${firstName} ${lastName}!\n\nDetails:\nAge: ${age}\nEmail: ${email}\nPhone:`);

        // Clear the form fields after submission
        joinForm.reset();
    });
}

// ---------- Get Started Section
document.addEventListener("DOMContentLoaded", function () {
    const loseWeightBtn = document.getElementById("loseWeightBtn");
    const gainWeightBtn = document.getElementById("gainWeightBtn");
    const bmiSection = document.getElementById("bmiSection");
    const planSection = document.getElementById("planSection");
    const planMessage = document.getElementById("planMessage");
    let userGoal = "";

    if (loseWeightBtn && gainWeightBtn) {
        loseWeightBtn.addEventListener("click", function () {
            userGoal = "lose";
            bmiSection.style.display = "block";
        });

        gainWeightBtn.addEventListener("click", function () {
            userGoal = "gain";
            bmiSection.style.display = "block";
        });

        document.getElementById("bmiForm").addEventListener("Submit", function (event) {
            event.preventDefault();

            const height = parseFloat(document.getElementById("height").value) / 100;
            const weight = parseFloat(document.getElementById("weight").value);
            const age = parseInt(document.getElementById("age").value);

            const bmi = weight / (height * height);
            let recommendation = "";

            if (userGoal === "lose") {
                recommendation = `Based on your BMI of ${bmi.toFixed(1)}, we recommend a calorie deficit plan with high-intensity cardio and strength training.`;
            } else if (userGoal === "gain") {
                recommendation = `Based on your BMI of ${bmi.toFixed(1)}, we recommend a calorie surplus plan with a focus on resistance training for muscle growth.`;
            }

            planMessage.textContent = recommendation;
            planSection.style.display = "block";
            bmiSection.style.display = "none";
        });
    }
});

// ---------- Nutrition Club
document.addEventListener("DOMContentLoaded", () => {
    const recipeToggles = document.querySelectorAll(".recipe-toggle");

    recipeToggles.forEach(button => {
        button.addEventListener("click", () => {
            const recipeDetails = button.nextElementSibling;
            if (recipeDetails.style.display === "block") {
                recipeDetails.style.display = "none";
                button.textContent = "View Recipe";
            } else {
                recipeDetails.style.display = "block";
                button.textContent = "Hide Recipe";
            }
        });
    });
});


// ---------- Chatbot Integration
async function sendMessageToChatbot(message) {
    try {
        const response = await fetch('http://localhost:5000/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Chatbot error:", error);
    }
}

async function sendChatMessage() {
    const inputField = document.getElementById('chatbot-input');
    const message = inputField.value;

    displayMessage('User', message);

    const response = await sendMessageToChatbot(message);
    displayMessage('Chatbot', response);

    inputField.value = '';
}

function displayMessage(sender, text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender.toLowerCase());
    messageElement.textContent = `${sender}: ${text}`;
    messagesContainer.appendChild(messageElement);
}

// ---------- User API Integration
document.addEventListener('DOMContentLoaded', async () => {
    const usersList = document.getElementById('usersList');

    if (usersList) {
        try {
            // Fetch users from the backend
            const response = await axios.get('http://localhost:5000/api/users/');
            const users = response.data;

            // Clear any placeholder content
            usersList.innerHTML = '';

            if (users.length > 0) {
                // Loop through users and add to the DOM
                users.forEach(user => {
                    const userItem = document.createElement('div');
                    userItem.classList.add('user-item');
                    userItem.innerHTML = `
                        <p><strong>Name:</strong> ${user.name}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Age:</strong> ${user.age}</p>
                        <p><strong>Height:</strong> ${user.height} cm</p>
                        <p><strong>Weight:</strong> ${user.weight} kg</p>
                        <p><strong>Goal:</strong> ${user.goal}</p>
                        <hr>
                    `;
                    usersList.appendChild(userItem);
                });
            } else {
                usersList.innerHTML = '<p>No users found.</p>';
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            usersList.innerHTML = '<p>Error fetching users. Please try again later.</p>';
        }
    }
});



sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);
    userInput.value = '';

    let apiEndpoint = '/chatbot';
    let requestData = { message: userMessage };

    if (userMessage.toLowerCase().includes('diet')) {
        apiEndpoint = '/predict/diet';

        // Prompt user for details if not already provided
        const height = prompt("Enter your height in cm (e.g., 170):");
        const weight = prompt("Enter your weight in kg (e.g., 70):");
        const age = prompt("Enter your age in years (e.g., 25):");
        const activity = prompt("Enter your activity level (low, medium, high):");

        if (!height || !weight || !age || !activity) {
            addMessage('bot', "Please provide all the required details for a diet plan.");
            return;
        }

        requestData = {
            height: parseFloat(height),
            weight: parseFloat(weight),
            age: parseInt(age, 10),
            activity: activity.toLowerCase(),
        };
    } else if (userMessage.toLowerCase().includes('workout')) {
        apiEndpoint = '/predict/workout';

        const goal = prompt("Enter your fitness goal (e.g., strength, cardio):");
        if (!goal) {
            addMessage('bot', "Please provide your fitness goal for a workout plan.");
            return;
        }

        requestData = { goal: goal.toLowerCase() };
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000${apiEndpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        if (result.recommendation) {
            const reply = formatRecommendation(result.recommendation);
            addMessage('bot', reply);
        } else if (result.response) {
            addMessage('bot', result.response);
        } else {
            addMessage('bot', "No recommendation available.");
        }
    } catch (error) {
        addMessage('bot', `Error: ${error.message}`);
    }
});

function formatRecommendation(recommendation) {
    if (Array.isArray(recommendation)) {
        return recommendation
            .map((item, index) => {
                if (typeof item === 'object') {
                    return `${index + 1}. ${Object.entries(item)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}`;
                }
                return `${index + 1}. ${item}`;
            })
            .join('<br>');
    }
    return recommendation;
}

if (userMessage.toLowerCase().includes('diet')) {
    apiEndpoint = '/predict/diet';

    const height = prompt("Enter your height in cm (e.g., 170):");
    const weight = prompt("Enter your weight in kg (e.g., 70):");
    const age = prompt("Enter your age in years (e.g., 25):");
    const activity = prompt("Enter your activity level (low, medium, high):");
    const feature_x = prompt("Enter an additional feature value (e.g., 1.0):");

    if (!height || !weight || !age || !activity || !feature_x) {
        addMessage('bot', "Please provide all required details for a diet plan.");
        return;
    }

    requestData = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age, 10),
        activity: activity.toLowerCase(),
        feature_x: parseFloat(feature_x)
    };
} else if (userMessage.toLowerCase().includes('workout')) {
    apiEndpoint = '/predict/workout';
    const goal = prompt("Enter your fitness goal (e.g., strength, cardio):");
    if (!goal) {
        addMessage('bot', "Please provide your fitness goal for a workout plan.");
        return;
    }
    requestData = { goal: goal.toLowerCase() };
}



// Chatbot Event Listener
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);
    userInput.value = '';

    let apiEndpoint = '/chatbot';
    let requestData = {};

    if (userMessage.toLowerCase().includes('diet')) {
        apiEndpoint = '/predict/diet';

        const caloriesMatch = userMessage.match(/(\d+)/); // Extract calorie value
        if (!caloriesMatch) {
            addMessage('bot', "Please specify how many calories you'd like your diet to include.");
            return;
        }

        const calories = parseInt(caloriesMatch[1], 10);
        requestData = { calories };
    } else if (userMessage.toLowerCase().includes('workout')) {
        apiEndpoint = '/predict/workout';

        const goal = userMessage.match(/(strength|cardio|endurance)/i)?.[0] || 'strength'; // Default goal
        requestData = { goal: goal.toLowerCase() };
    } else {
        addMessage('bot', "I can help you with diet plans or workout routines. Please ask a specific question!");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000${apiEndpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.recommendation) {
            const reply = userMessage.toLowerCase().includes('workout')
                ? formatWorkoutRecommendation(result.recommendation)
                : formatDietRecommendation(result.recommendation);
            addMessage('bot', reply);
        } else if (result.error) {
            addMessage('bot', `Error: ${result.error}`);
        } else {
            addMessage('bot', "No recommendation available.");
        }
    } catch (error) {
        addMessage('bot', `Error: ${error.message}`);
        console.error('Fetch Error:', error);
    }
});

function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatDietRecommendation(recommendation) {
    return recommendation.map((meal) => {
        const items = meal.items.map(item => `${item.name} (${item.calories} calories)`).join(', ');
        return `<strong>${meal.meal}</strong>: ${meal.calories} calories<br>Items: ${items}`;
    }).join('<br><br>');
}

function formatRecommendation(recommendation, isWorkout = false) {
    if (Array.isArray(recommendation)) {
        if (isWorkout) {
            // Format workout recommendations
            return recommendation.map((exercise, index) => {
                return `${index + 1}. <strong>${exercise.exercise}</strong>: ${exercise.sets} sets x ${exercise.reps} reps, ${exercise.duration}`;
            }).join('<br>');
        } else {
            // Format diet recommendations
            return recommendation.map((meal) => {
                const items = meal.items.map(item => `${item.name} (${item.calories} calories)`).join(', ');
                return `<strong>${meal.meal}</strong>: ${meal.calories} calories<br>Items: ${items}`;
            }).join('<br><br>');
        }
    }
    return recommendation;
}
