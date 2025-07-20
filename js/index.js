const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results-list');
const reposList = document.getElementById('repos-list');
const toggleButton = document.getElementById('toggle-search');
const resultsTitle = document.getElementById('results-title');

let searchMode = 'users'; // or 'repos'

// Function to fetch users or repositories
async function searchGitHub(query) {
  const url = searchMode === 'users'
    ? `https://api.github.com/search/users?q=${query}`
    : `https://api.github.com/search/repositories?q=${query}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  const data = await response.json();

  displayResults(data.items);
}

// Display users or repositories
function displayResults(items) {
  resultsList.innerHTML = '';
  reposList.innerHTML = '';

  if (searchMode === 'users') {
    items.forEach(user => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
        <strong>${user.login}</strong> - <a href="${user.html_url}" target="_blank">Profile</a>
      `;
      li.addEventListener('click', () => fetchRepos(user.login));
      resultsList.appendChild(li);
    });
  } else {
    items.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${repo.full_name}</strong> - ⭐ ${repo.stargazers_count}
        <br><a href="${repo.html_url}" target="_blank">View Repo</a>
      `;
      resultsList.appendChild(li);
    });
  }
}

// Fetch repositories for a user
async function fetchRepos(username) {
  const url = `https://api.github.com/users/${username}/repos`;

  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  const repos = await response.json();

  reposList.innerHTML = '';
  repos.forEach(repo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${repo.name}</strong> - ⭐ ${repo.stargazers_count}
      <br><a href="${repo.html_url}" target="_blank">View Repo</a>
    `;
    reposList.appendChild(li);
  });
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchGitHub(query);
  }
});

// Toggle between user and repo search
toggleButton.addEventListener('click', () => {
  searchMode = searchMode === 'users' ? 'repos' : 'users';
  resultsTitle.textContent = searchMode === 'users' ? 'Users' : 'Repositories';
  toggleButton.textContent = searchMode === 'users'
    ? 'Switch to Repo Search'
    : 'Switch to User Search';
  resultsList.innerHTML = '';
  reposList.innerHTML = '';
});
