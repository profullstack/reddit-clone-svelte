<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { userStore } from './store'
  import decode from 'jwt-decode'

  let user
  userStore.subscribe(value => {
    user = value
  })

  onMount(() => {
    if (user) navigate('/')
  })

  const register = async (event) => {
    event.preventDefault()
    const form = document.getElementById('register')
    const formData = new FormData(form)
    form.reset()

    const url = 'API_BASE_URL/register'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password')
      })
    })

    if (!res.ok) alert('Something went wrong!')
    const { token } = await res.json()

    try {
      userStore.update(() => decode(token).user)
      localStorage.setItem('token', token)
    } catch (error) {
      console.log(error)
    }

    return navigate('/')
  }
</script>

<style>
  .signup {
    width: 300px;
  }
  @media only screen and (max-width: 800px) {
    .signup {
      width: 100%;
    }
  }
</style>

<form class="signup" id="register">
  <fieldset>
    <input type="text" placeholder="Username" id="username" name="username">
    <input type="password" placeholder="Password" id="password" name="password">
    <input type="password" placeholder="Confirm Password" id="confirmPassword" name="confirmPassword">
    <button class="button-primary float-right" type="submit" on:click={ register }>Signup</button>
  </fieldset>
</form>
