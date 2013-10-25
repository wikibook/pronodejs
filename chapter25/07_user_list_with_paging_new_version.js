h1 Users

p
  a(href="/users/new") Create new profile

ul
  - users.forEach(function(user) {
    li
      a(href="/users/" + encodeURIComponent(user.username))= user.name
  - });

- if (page > 0) {
  a(href="?page=" + (page - 1)) Previous
  &nbsp;
- }

- if (! lastPage) {
  a(href="?page=" + (page + 1)) Next
- }