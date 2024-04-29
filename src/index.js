let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
 // Function to fetch Andy's Toys
 function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      // Call function to display toys
      displayToys(data);
    })
    .catch(error => console.error("Error fetching toys:", error));
}

// Function to display toys
function displayToys(toys) {
  const toyCollection = document.getElementById("toy-collection");

  toys.forEach(toy => {
    // Create a div element for each toy
    const card = document.createElement("div");
    card.classList.add("card");

    // Create h2 tag for toy name
    const name = document.createElement("h2");
    name.textContent = toy.name;

    // Create img tag for toy image
    const image = document.createElement("img");
    image.src = toy.image;
    image.classList.add("toy-avatar");

    // Create p tag for toy likes
    const likes = document.createElement("p");
    likes.textContent = `${toy.likes} Likes`;

    // Create button tag for like button
    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.dataset.id = toy.id; // Using dataset to store toy id
    likeButton.textContent = "Like ❤️";

    // Event listener for like button
    likeButton.addEventListener("click", (event) => {
      // Get the id of the toy from the button's dataset
      const toyId = event.target.dataset.id;
      // Call function to increase toy likes
      increaseLikes(toyId);
    });

    // Append all elements to the card div
    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(likes);
    card.appendChild(likeButton);

    // Append the card to the toy collection div
    toyCollection.appendChild(card);
  });
}

// Function to increase a toy's likes
function increaseLikes(toyId) {
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: parseInt(document.querySelector(`button[data-id="${toyId}"]`).previousElementSibling.textContent) + 1
    })
  })
  .then(response => response.json())
  .then(data => {
    // Update toy's likes in the DOM
    document.querySelector(`button[data-id="${toyId}"]`).previousElementSibling.textContent = `${data.likes} Likes`;
  })
  .catch(error => console.error("Error increasing likes:", error));
}

// Event listener for submitting new toy form
document.querySelector(".add-toy-form").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get("name");
  const image = formData.get("image");

  // Add new toy
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
  .then(response => response.json())
  .then(data => {
    // Call function to display the new toy
    displayToys([data]);
  })
  .catch(error => console.error("Error adding new toy:", error));
});

// Call fetchToys function when the DOM content is loaded
fetchToys();

