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
    const urlParams = new URLSearchParams(window.location.search)
    type = urlParams.get('sort')
    
    if (type === 'hot') {
      sort = '-rank'
    } else if (type === 'top') {
      sort = '-score'
    } else if (type === 'new') {
      sort = '-created'
    } else if (type === 'comments') {
      sort = '-score';
    } else if (type === 'not') {
      sort = '+score';
    }

    let url = 'API_BASE_URL'

    if (username) url += `/user/${username}?sort=${sort}`
    else if (category) url += `/posts/${category}?sort=${sort}`
    else url += `/posts?sort=${sort}`

    const res = await fetch(url)
    if (!res.ok) return alert('Something wrong!')
    posts = await res.json()
  
    posts = posts.sort((a, b) => {
      if (type === 'comments') {
        return b.commentCount - a.commentCount;
      }
    });
  }

  const fetchCategory = async (category) => {
    let url = 'API_BASE_URL' + `/category/${category}`

    const res = await fetch(url)
    if (!res.ok) return alert('Failed to fetch category info!')
    categoryData = await res.json()
  }

  $: fetchPost({ type, username, category, $activeRoute })
  $: fetchCategory(category)
</script>

{#if category}
<h4><a href={`/a/${category}`}>a/{category}</a></h4>
<p>{ categoryData.description }</p>
{:else if username}
<h4><a href={`/u/${username}`}>u/{username}</a></h4>

{/if}
<nav class="topnav">
  <Link to="{$activeRoute.uri}?sort=hot">Hot</Link>
  <Link to="{$activeRoute.uri}?sort=new">New</Link>
  <Link to="{$activeRoute.uri}?sort=top">Top</Link>
  <Link to="{$activeRoute.uri}?sort=comments">Comments</Link>
  <Link to="{$activeRoute.uri}?sort=not">Controversial</Link>
  <a href={`/api/1/${(username ? 'user' : 'posts' )}/${category || username ? (category || username)+'/' : ''}rss?sort=${sort}`}>RSS</a>
</nav>
{#each posts as post}
  <Post { post }></Post>
{/each}
