<script>
  import Post from './Post.svelte'
  import { Link } from 'svelte-routing'
  import { onMount, getContext } from 'svelte'
  import { userStore, currentCategory } from './store'
  import {ROUTER} from 'svelte-routing/src/contexts';
  const { activeRoute } = getContext(ROUTER);

  export let username = null
  export let category = null
  let posts = []
  let sort
  let type
  let categoryData = {}
  let page = 1

  let currentCat
  currentCategory.subscribe(value => {
    currentCat = value
  })

  let user
  userStore.subscribe(value => {
    if (value) {
      user = value
    }
  })

  $: {    
    if (category) {
      document.title = `${category} - upvotocracy.com`
      currentCategory.set(category)
    }
    else {
      document.title = 'upvotocracy.com'
    }
  }

  const fetchPost = async ({ type, username, category }) => {
    await sorter()

    let url = 'API_BASE_URL'

    if (username) url += `/user/${username}?sort=${sort}&page=${page}`
    else if (category) url += `/posts/${category}?sort=${sort}&page=${page}`
    else url += `/posts?sort=${sort}&page=${page}`

    const res = await fetch(url)
    if (!res.ok) return alert('Something wrong!')
    let post = await res.json()
    if (page > 1) {
      posts = posts.concat(post)
    }
    else {
      posts = post
    }
  }

  const fetchCategory = async (category) => {
    page = 1
    let url = 'API_BASE_URL' + `/category/${category}`

    const res = await fetch(url)
    if (!res.ok) return alert('Failed to fetch category info!')
    categoryData = await res.json()
  }

  const sorter = () => {
    const urlParams = new URLSearchParams(window.location.search)
    type = urlParams.get('sort')
    
    if (type === 'hot') {
      sort = '-rank'
    } else if (type === 'top') {
      sort = '-score'
    } else if (type === 'new') {
      sort = '-created'
    } else if (type === 'comments') {
      sort = 'comments';
    } else if (type === 'not') {
      sort = '+score';
    }

    return true;
  }

  $: fetchPost({ type, username, category, page, $activeRoute })
  $: fetchCategory(category)
</script>

{#if category}
<h4><a href={`/a/${category}`}>a/{category}</a></h4>
<p>{ categoryData.description }</p>
{:else if username}
<h4><a href={`/u/${username}`}>u/{username}</a></h4>

{/if}
<nav class="topnav">
  <Link to="{$activeRoute.uri}?sort=hot" on:click={ () => page = 1 }>Hot</Link>
  <Link to="{$activeRoute.uri}?sort=new" on:click={ () => page = 1 }>New</Link>
  <Link to="{$activeRoute.uri}?sort=top" on:click={ () => page = 1 }>Top</Link>
  <Link to="{$activeRoute.uri}?sort=comments" on:click={ () => page = 1 }>Comments</Link>
  <Link to="{$activeRoute.uri}?sort=not" on:click={ () => page = 1 }>Controversial</Link>
  <a href={`/api/1/${(username ? 'user' : 'posts' )}/${category || username ? (category || username)+'/' : ''}rss?sort=${sort}`}>RSS</a>
</nav>
{#each posts as post}
  <Post { post }></Post>
{/each}

{#if posts.length > 0}
  <a href="javascript:void(0)" on:click={ () => page += 1 }><button>Load More</button></a>
{/if}
