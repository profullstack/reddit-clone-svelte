<script>
  import { onMount } from 'svelte'
  import { Link } from 'svelte-routing'
  import { categories } from './store'

  let cats = []
  let filtered = [];
  let search = '';

  function filterCategories() {
    filtered = cats.filter(c => {
      if (c.name.toLowerCase().indexOf(search.toLowerCase()) > -1){
        return c;
      }
    })
  }

  onMount(async () => {
    const url = 'API_BASE_URL/category'
    const res = await fetch(url, {
      method: 'GET'
    })

    cats = await res.json()
    categories.set(cats)
    filtered = cats;
  })
</script>

<style>
  .sidebar {
    margin: 0 1rem;
    display: block;
    justify-content: space-between;
    background-color: #f9f9f9;
    width: 200px;
    padding: 1rem;
    height: calc(100vh - 6.8rem);
    width: 25rem;
    flex-shrink: 0;
    overflow-y: auto;
    position: sticky;
    top: 6.8rem;
  }

  .sidebar ul{
    list-style: none;
    margin-bottom: 0px;
  }

  .sidebar input {
    background-color: #fff;
  }
  
  @media only screen and (max-width: 850px) {
    .sidebar {
      display: none;
    }
  }
</style>

<div class="sidebar">
  <h3> Categories </h3>
  <input type="text" bind:value={search} on:keyup={filterCategories} />
  <ul>
    {#each filtered as category}
      <li>
        <Link to="/a/{ category.name }"><span>{ category.name }</span></Link>
      </li>
    {/each}
  </ul>
</div>