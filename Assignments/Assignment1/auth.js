function isAuthenticated() {
  return localStorage.getItem('auth') === 'true'
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html'
  }
}

function getUsers() {
  const users = localStorage.getItem('users')
  try {
    return users ? JSON.parse(users) : []
  } catch (e) {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

function register(username, password) {
  username = username.trim()
  if (!username || !password)
    return { success: false, message: 'Username and password required.' }
  let users = getUsers()
  if (users.find((u) => u.username === username)) {
    return { success: false, message: 'Username already exists.' }
  }
  users.push({ username, password })
  saveUsers(users)
  return { success: true }
}

function login(username, password) {
  let users = getUsers()
  if (users.find((u) => u.username === username && u.password === password)) {
    localStorage.setItem('auth', 'true')
    localStorage.setItem('auth_user', username)
    return true
  }
  return false
}

function logout() {
  localStorage.removeItem('auth')
  window.location.href = 'login.html'
}

window.isAuthenticated = isAuthenticated
window.requireAuth = requireAuth
window.login = login
window.logout = logout
window.register = register
