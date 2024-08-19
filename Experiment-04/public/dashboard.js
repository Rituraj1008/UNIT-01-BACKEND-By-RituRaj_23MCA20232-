document.addEventListener('DOMContentLoaded', () => {
  fetch('/users')
    .then(response => response.json())
    .then(users => {
      displayUserData(users);
    })
    .catch(error => console.error('Error fetching user data:', error));
});

function displayUserData(users) {
  const userDetails = document.getElementById('userDetails');
  userDetails.innerHTML = ''; // Clear existing data

  users.forEach(user => {
    const userRow = document.createElement('tr');
    userRow.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.password}</td>
      <td>
        <button onclick="editUser(${user.id})">Edit</button>
        <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userDetails.appendChild(userRow);
  });
}

function editUser(id) {
  const newName = prompt('Enter new name:');
  const newEmail = prompt('Enter new email:');
  const newPassword = prompt('Enter new password:');

  if (newName && newEmail && newPassword) {
    fetch(`/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword })
    })
      .then(response => {
        if (response.ok) {
          alert('User updated successfully!');
          window.location.reload(); // Reload the page to show updated data
        } else {
          alert('Failed to update user.');
        }
      });
  }
}

function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`/users/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          alert('User deleted successfully!');
          window.location.reload(); // Reload the page to update the table
        } else {
          alert('Failed to delete user.');
        }
      });
  }
}
