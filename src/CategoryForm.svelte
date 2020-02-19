<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { userStore } from './store'

  let user
  userStore.subscribe(value => {
    user = value
  })

  onMount(() => {
    if (!user) navigate('/')
  })

  const createCategory = async (event) => {
    event.preventDefault()
    const form = document.getElementById('create-category')
    const formData = new FormData(form)
    form.reset()

    const token = localStorage.getItem('token')

    const url = 'API_BASE_URL/api/category'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.get('name'),
        description: formData.get('description')
      })
    })

    if (!res.ok) alert('Something went wrong!')
    window.location = '/'
  }
</script>

<style>
  label {
    font-display: normal;
    font-weight: 300;
    font-size: 1em;
  }
</style>

<form id="create-category">
  <fieldset>
    <label for="name">Category Name</label>
    <input type="text" placeholder="Put the category name here ..." id="name" name="name">
    <label for="description">Description</label>
    <textarea placeholder="Put the description here ..." id="description" name="description"></textarea>
    <button class="button-primary float-right" type="submit" on:click={ createCategory }>Submit</button>
  </fieldset>
</form>
