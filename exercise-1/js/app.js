// Get users list from API
const getUsers = () => {
  fetch('https://5dc588200bbd050014fb8ae1.mockapi.io/assessment')
    .then((resp) => resp.json())
    .then((users) => {
      users.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
      buildUsersList(users);
    })
    .catch((error) => {
      console.log(error);
    });
};

getUsers();

// Add handlebars helper for date
Handlebars.registerHelper('dateTime', function (date) {
  return new Date(date).toLocaleDateString();
});

// Apply template and add users into HTML
const buildUsersList = (users) => {
  const usersListTemplate = document.getElementById('users-template').innerHTML;
  const compiledTemplate = Handlebars.compile(usersListTemplate);
  const usersWrapper = document.getElementById('users-wrapper');
  usersWrapper.innerHTML = compiledTemplate({ users });

  // Handle on click toggle more info button event
  document.querySelectorAll('.toggle-info').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.target.innerHTML =
        event.target.innerHTML == 'Show more' ? 'Show less' : 'Show more';
      event.target.previousElementSibling.classList.toggle('active');
    });
  });
};

module.exports = {
  getUsers,
};
