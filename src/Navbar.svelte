<script>
  import { Link } from 'svelte-routing'
  import { userStore, showOverlay } from './store'
  import OverlayMenu from './OverlayMenu.svelte'

  let show
  showOverlay.subscribe(value => {
    show = value
  })

  let user
  userStore.subscribe(value => {
    user = value
  })

  const logout = () => {
    localStorage.removeItem('token')
    userStore.update(() => undefined)
  }

  const toggleOverlay = () => {
    showOverlay.set(true)
  }
</script>

<style>
  .logo {
    height: 3rem;
  }
  .navbar {
    padding-bottom: 1em;
    border-bottom: .1em solid #d1d1d1;
    margin-top: 2em;
  }
  .navbar .float-right .navbar-item {
    margin-left: 1.2em;
  }
  .navbar button {
    margin-left: 1.2em;
  }
  #toggle-overlay {
    display: none;
  }
  @media only screen and (max-width: 800px) {
    .navbar-item {
      display: none;
    }
    #toggle-overlay {
      display: block;
    }
  }

</style>
{#if show}
  <OverlayMenu></OverlayMenu>
{/if}
<div class="navbar">
  <span><Link to="/"><img class="logo" src="/images/logo.svg" alt="upvotocracy" /></Link></span>
  <div class="float-right">
    {#if user}
      <Link to="/compose"><button class="navbar-item">Create a post</button></Link>
      <Link to="/newcategory"><button class="navbar-item">Create a category</button></Link>
      <span class="navbar-item"><Link to="/u/{ user.username }">{ user.username.toUpperCase() }</Link></span>
      <span class="navbar-item"><Link on:click={ logout }>LOGOUT</Link></span>
    {:else}
      <span class="navbar-item"><Link to="/login">LOGIN</Link></span>
      <span class="navbar-item"><Link to="/register">REGISTER</Link></span>
    {/if}
    <button id="toggle-overlay" on:click={ toggleOverlay }>Menu</button>
  </div>
</div>
