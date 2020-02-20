<script>
  import { slide } from 'svelte/transition'
  import { userStore, categories, showOverlay } from './store'
  import { Link } from 'svelte-routing'

  let cats = []
  categories.subscribe(value => {
    cats = value
  })

  let user
  userStore.subscribe(value => {
    user = value
  })

  const logout = () => {
    localStorage.removeItem('token')
    userStore.update(() => undefined)
    hideOverlay()
  }

  const hideOverlay = () => {
    showOverlay.set(false)
  }
</script>

<style>
  .overlay {
    overflow: scroll;  
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #9b4dca;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    text-align: center;
  }
  .close-button {
    position: absolute;
    right: 0;
    top: 0;
    width: 55px;
    height: 55px;
    cursor: pointer;
  }
  .overlay h3 {
    text-decoration: underline;
    color: white;
  }
  .categories {
    margin-top: 20px;
  }
  .menu {
    margin-top: 50px;
  }
  button {
    background: #bd7ee4;
  }
  span{
    color: white;
    font-size: 24px;
  }
  ul {
    list-style: none;
  }
</style>


<div class="overlay" in:slide="{{ duration: 500 }}" out:slide="{{ duration: 200 }}">
  <div class="menu">
    {#if user}
      <div>
        <Link on:click={ hideOverlay } to="/compose"><button class="navbar-item">Create a post</button></Link>
        <Link on:click={ hideOverlay } to="/newcategory"><button class="navbar-item">Create a category</button></Link>
      </div>
      <div>
        <Link on:click={ hideOverlay } to="/u/{ user.username }"><button class="navbar-item">{ user.username.toUpperCase() }</button></Link>
        <Link on:click={ logout }><button class="navbar-item">LOGOUT</button></Link>
      </div>
    {:else}
      <Link on:click={ hideOverlay } to="/login"><button class="navbar-item">LOGIN</button></Link>
      <Link on:click={ hideOverlay } to="/register"><button class="navbar-item">REGISTER</button></Link>
    {/if}
  </div>
  <div class="categories">
    <h3> Categories </h3>
    <ul>
      {#each cats as category}
        <li>
          <Link on:click={ hideOverlay } to="/a/{ category.name }"><span>{ category.name }</span></Link>
        </li>
      {/each}
    </ul>
  </div>
  <a href="javascript:void(0)" on:click={ hideOverlay }><img class="close-button" src="/close.png" alt="close menu"></a>
</div>