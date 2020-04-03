import { userStore } from './store'

let user;
userStore.subscribe(value => {
  user = value
})

const addSubscription = async (id) => {
  const url = `API_BASE_URL/me/subscriptions/${id}`
  const token = localStorage.getItem('token')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) alert('Something went wrong!')
  user.subscriptions.push(id)
  userStore.set(user);
}

const removeSubscription = async (id) => {
  const url = `API_BASE_URL/me/subscriptions/${id}`
  const token = localStorage.getItem('token')

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) alert('Something went wrong!')
  const index = user.subscriptions.findIndex(i => i == id);
  user.subscriptions.splice(index, 1);
  userStore.set(user);
}

export {
  addSubscription,
  removeSubscription,
}