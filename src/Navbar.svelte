<script>
  import { onMount } from 'svelte'
  import { Link, navigate } from 'svelte-routing'
  import { userStore } from './store'
  import { slide } from 'svelte/transition'

  let showMoreCategories = false
  let shownCategories = []
  let hiddenCategories = []

  let user
  userStore.subscribe(value => {
    user = value
  })

  const logout = () => {
    localStorage.removeItem('token')
    userStore.update(() => undefined)
  }

  const toggleMore = () => {
    showMoreCategories = !showMoreCategories
  }

  onMount(async () => {
    const url = 'API_BASE_URL/api/category'
    const res = await fetch(url, {
      method: 'GET'
    })
    shownCategories = await res.json()
    if (shownCategories.length > 5) {
      hiddenCategories = shownCategories.splice(5)
    }
  })
</script>

<style>
  .navbar {
    padding-bottom: .4em;
    border-bottom: .1em solid #d1d1d1;
    margin-top: 2em;
  }
  .navbar .float-right .navbar-item { margin-left: 1.2em; }
  .categories-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: .6em 0 .3em 0;
    margin-bottom: 0.5em;
  }
  .more-categories {
    display: block;
    justify-content: space-between;
    background-color: #f4e1ff;
    max-width: 180px;
    text-align: center;
    padding: 10px;
  }
  .more-categories ul{
    list-style: none;
    margin-bottom: 0px;
  }
  .more-categories li {
    margin: 10px;
  }
  #showMoreBtn {
    margin-bottom: 2em;
  }
</style>

<div class="navbar">
  <span><Link to="/"><strong>REDDIT CLONE</strong></Link></span>
  <div class="float-right">
    {#if user}
      <span class="navbar-item"><Link to="/u/{ user.username }">{ user.username.toUpperCase() }</Link></span>
      <span class="navbar-item"><Link on:click={ logout }>LOGOUT</Link></span>
    {:else}
      <span class="navbar-item"><Link to="/login">LOGIN</Link></span>
      <span class="navbar-item"><Link to="/register">REGISTER</Link></span>
    {/if}
  </div>
</div>

<div class="categories-container">
  {#each shownCategories as category}
    <Link to="/a/{ category.name }"><span>{ category.name }</span></Link>
  {/each}
  <button on:click={() => navigate('/newcategory') }>Create Category</button>
</div>

{#if showMoreCategories}
  <div transition:slide="{{ duration: 400 }}" class="more-categories">
    <ul>
    {#each hiddenCategories as category}
      <li>
        <Link to="/a/{ category.name }"><span>{ category.name }</span></Link>
      </li>
    {/each}
    </ul>
  </div>
{/if}

<button id="showMoreBtn" on:click={ toggleMore }>More Categories</button>