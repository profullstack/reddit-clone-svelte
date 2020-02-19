<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { userStore } from './store'

  let scoops = 'link'
  let categories = []
  let user
  userStore.subscribe(value => {
    user = value
  })

  onMount(async () => {
    if (!user) navigate('/')

    const url = 'API_BASE_URL/api/category'
    const res = await fetch(url, {
      method: 'GET'
    })

    categories = await res.json()
  })

  const createPost = async (event) => {
    event.preventDefault()
    const form = document.getElementById('create-post')
    const formData = new FormData(form)
    form.reset()

    const token = localStorage.getItem('token')

    const url = 'API_BASE_URL/api/posts'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        type: formData.get('type'),
        category: formData.get('category'),
        title: formData.get('title'),
        url: formData.get('url'),
        text: formData.get('text')
      })
    })

    if (!res.ok) alert('Something went wrong!')
    return navigate('/')
  }
</script>

<style>
  label {
    font-display: normal;
    font-weight: 300;
    font-size: 1em;
  }
  .category-toggle {
    margin-bottom: 1.5em;
  }
  .btn {
    display: inline-block;
    padding: .2em;
    width: 50%;
    position: relative;
    text-align: center;
    transition: background 600ms ease, color 600ms ease;
  }
  input[type="radio"].toggle {
    display: none;
  }
  input[type="radio"].toggle + label {
    cursor: pointer;
    min-width: 60px;
  }
  input[type="radio"].toggle + label:hover {
    background: none;
  }
  input[type="radio"].toggle + label:after {
    border-bottom: 0.1rem solid #9b4dca;
    content: "";
    height: 100%;
    position: absolute;
    top: 0;
    transition: left 200ms cubic-bezier(0.77, 0, 0.175, 1);
    width: 100%;
    z-index: -1;
  }
  input[type="radio"].toggle.toggle-left + label {
    border-right: 0;
  }
  input[type="radio"].toggle.toggle-left + label:after {
    left: 100%;
  }
  input[type="radio"].toggle.toggle-right + label {
    margin-left: -5px;
  }
  input[type="radio"].toggle.toggle-right + label:after {
    left: -100%;
  }
  input[type="radio"].toggle:checked + label {
    cursor: default;
    color: #9b4dca;
    transition: color 200ms;
  }
  input[type="radio"].toggle:checked + label:after {
    left: 0;
  }
</style>

<form id="create-post">
  <fieldset>
    <div class="category-toggle">
      <input id="toggle-on" class="toggle toggle-left" name="type" type="radio" checked bind:group={scoops} value={ 'link' }>
      <label for="toggle-on" class="btn">Link</label>
      <input id="toggle-off" class="toggle toggle-right" name="type" type="radio" bind:group={scoops} value={ 'text' }>
      <label for="toggle-off" class="btn">Text</label>
    </div>
    <label for="category">Category</label>
    <select id="category" name="category">
      {#each categories as category}
        <option value="{ category._id }">{ category.name }</option>
      {/each}
    </select>
    <label for="title">Title</label>
    <input type="text" placeholder="Put your title here ..." id="title" name="title">
    {#if scoops === 'link'}
      <label for="url">Link</label>
      <input type="text" placeholder="https:// ..." id="url" name="url">
    {:else}
      <label for="text">Text</label>
      <textarea placeholder="Put your text here ..." id="text" name="text"></textarea>
    {/if}
    <button class="button-primary float-right" type="submit" on:click={ createPost }>Create Post</button>
  </fieldset>
</form>
