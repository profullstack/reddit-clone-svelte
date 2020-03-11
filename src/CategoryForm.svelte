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

  let msg = {
    error: ''
  }

  const createCategory = async (event) => {
    event.preventDefault()
    const form = document.getElementById('create-category')
    const formData = new FormData(form)
    form.reset()

    const token = localStorage.getItem('token')
    const name = formData.get('name');
    const url = 'API_BASE_URL/category'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description: formData.get('description')
      })
    }).then(async (res) => {
      if (!res.ok) {
        console.log(res.clone().json())
        let response = await res.clone().json()
        let message = `ERROR: ${response.errors[0].param} ${response.errors[0].msg}`
        //alert(message)
        return { ok: false, error: message }
      } else {
        return { ok: true, ...res.json() }
      }
    })

    if (res.ok) {
      navigate(`/a/${name}`);
    }

    msg = res
    
  }
</script>

<style>
  label {
    font-display: normal;
    font-weight: 300;
    font-size: 1em;
  }
</style>

{#if !msg.ok} <div class="message error">{msg.error}</div>{/if}

<form id="create-category">
  <fieldset>
    <label for="name">Category Name</label>
    <input type="text" placeholder="Put the category name here ..." id="name" name="name">
    <label for="description">Description</label>
    <textarea placeholder="Put the description here ..." id="description" name="description"></textarea>
    <button class="button-primary float-right" type="submit" on:click={ createCategory }>Submit</button>
  </fieldset>
</form>
