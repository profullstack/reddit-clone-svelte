<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { userStore, currentCategory } from './store'

  let scoops = 'link'
  let categories = []
  let sortedCategories = [];
  let user
  userStore.subscribe(value => {
    user = value
  })

  let currentCat
  currentCategory.subscribe(value => {
    currentCat = value
  })

  async function onUrlBlur(e) {
    if (!title) {
      const form = document.getElementById('create-post');
      const formData = new FormData(form);
      const url = formData.get('url');
      const res = await getTitle(url);

      document.getElementById('title').value = res.title.slice(0, 100).trim();
    }
  }

  onMount(async () => {
    if (!user) navigate('/')

    const url = 'API_BASE_URL/category'
    const res = await fetch(url, {
      method: 'GET'
    })

    categories = await res.json()
    sortedCategories = categories.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
    });
  })

  async function getTitle(url) {
    return fetch('API_BASE_URL/retrieve?url='+url)
      .then(res => res.json())
      .catch(console.error);
  }

  const createPost = async (event) => {
    event.preventDefault()
    const form = document.getElementById('create-post')
    const formData = new FormData(form);
    form.reset()

    const token = localStorage.getItem('token')

    const api = 'API_BASE_URL/posts'
    const url = formData.get('url');
    const category = formData.get('category');

    const res = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        type: formData.get('type'),
        category,
        title: formData.get('title').slice(0, 100).trim(),
        url: url && url.trim(),
        text: formData.get('text')
      })
    }).then(res => {
      if (!res.ok) alert('Something went wrong!')
  
      return res.json()
    });

    return navigate(`/a/${res.category.name}/${res.id}`);
  }

  const urlParams = new URLSearchParams(window.location.search)
  const title = urlParams.get('title')
  const link = urlParams.get('link')
  const text = urlParams.get('text')

  if (urlParams.get('category')) {
    currentCat = urlParams.get('category')
  }
  if (urlParams.get('text')) {
    scoops = 'text'
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
    border-bottom: 0.1rem solid #13d583;
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
    color: #13d583;
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
      {#each sortedCategories as category}
        {#if category.name == currentCat}
          <option value="{ category._id }" selected>{ category.name }</option>
        {:else}
          <option value="{ category._id }">{ category.name }</option>
        {/if}
      {/each}
    </select>
    <label for="title">Title</label>
    <input type="text" placeholder="Put your title here ..." id="title" name="title" value="{title}">
    {#if scoops === 'link'}
      <label for="url">Link</label>
      <input type="text" placeholder="https:// ..." id="url" name="url" on:blur={onUrlBlur} value="{link}">
    {:else}
      <label for="text">Text</label>
      <textarea placeholder="Put your text here ..." id="text" name="text" value="{text}"></textarea>
    {/if}
    <button class="button-primary float-right" type="submit" on:click={ createPost }>Create Post</button>
  </fieldset>
</form>
