<script>
  import { slide } from 'svelte/transition'
  import { userStore, categories, showOverlay } from './store'
  import { Link } from 'svelte-routing'

  export let inboxCount

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
    background-color: #eafff6;
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
  }
  .categories {
    margin-top: 20px;
    max-height: 100vh;
    overflow-y: auto;
  }
  .menu {
    margin-top: 50px;
  }
  .vertical {
    vertical-align: bottom;
  }
  #mail-icon {    
    width: 23px;
    fill: white;
  }
  #inbox-count {
    color: white;
    margin-left: .2em;
    font-weight: 500;
    font-size: 18px;
  }
  span{
		color: #13d583;
		font-weight: 500;
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
        <Link on:click={ hideOverlay } to="/inbox"><button class="navbar-item vertical"><svg id="mail-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 435" xml:space="preserve"><g><g><path d="M496,64H16C7.168,64,0,71.168,0,80v352c0,8.832,7.168,16,16,16h480c8.832,0,16-7.168,16-16V80 C512,71.168,504.832,64,496,64z M450.384,96L256,251.504L61.616,96H450.384z M480,416H32V113.28l214,171.2 c2.928,2.352,6.464,3.52,10,3.52s7.072-1.168,10-3.504L480,113.28V416z"/></g></g></svg><span id="inbox-count">{inboxCount || ''}</span></button></Link>
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