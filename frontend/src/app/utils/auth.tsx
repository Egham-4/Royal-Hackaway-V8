export function saveToken(token: string) {
  localStorage.setItem("access_token", token)
}

export function getToken() {
  return localStorage.getItem("access_token")
}

export function removeToken() {
  localStorage.removeItem("access_token")
}

export function isAuthenticated() {
  const token = getToken()
  return token != null
}

export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
}

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user))
}

export function getUser() {
  const data = localStorage.getItem("user")
  return data ? JSON.parse(data) : null
}

export async function fetch_auth(url: string, opts) {
  opts.headers = {
    "Authorization": "Bearer " + getToken()
  }
  let response = await fetch(url, opts)
  let json = await response.json()

  return json
}
