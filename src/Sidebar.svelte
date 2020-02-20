<script>
  import { onMount } from 'svelte'
  import { Link } from 'svelte-routing'
  import { categories } from './store'

  let cats = []

  onMount(async () => {
    const url = 'API_BASE_URL/category'
    const res = await fetch(url, {
      method: 'GET'
    })

    cats = await res.json()
    categories.set(cats)
  })
</script>

<style>
  .sidebar {
    margin: 15px;
    display: block;
    justify-content: space-between;
    background-color: #f4e1ff;
    width: 200px;
    text-align: center;
    padding: 10px;
    position: absolute;
    top: auto;
    left: 0;
  }
  .sidebar ul{
    list-style: none;
    margin-bottom: 0px;
  }
  @media only screen and (max-width: 800px) {
    .sidebar {
      display: none;
    }
  }
</style>

<div class="sidebar">
  <h3> Categories </h3>
  <ul>
    {#each cats as category}
      <li>
        <Link to="/a/{ category.name }"><span>{ category.name }</span></Link>
      </li>
    {/each}
  </ul>
</div>