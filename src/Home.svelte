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
  let page = 0
  let morePosts

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
    const rss = document.querySelector('link[type="application/rss+xml"]');
          
    if (category) {
      document.title = `${category} - upvotocracy.com`
      rss.setAttribute('href', `https://upvotocracy.com/api/1/posts/${category}/rss?sort=-created`);
      rss.setAttribute('title', `Upvotocracy ${category} RSS Feed`);
      currentCategory.set(category)
    }
    else {
      document.title = 'upvotocracy.com'
      rss.setAttribute('href', `https://upvotocracy.com/api/1/posts/rss?sort=-created`);
      rss.setAttribute('title', `Upvotocracy RSS Feed`);
    }
  }

  const fetchPost = async ({ type, username, category }) => {
    await sorter()

    let url = 'API_BASE_URL'

    if (username) url += `/user/${username}?sort=${sort}&page=${page}`
    else if (category) url += `/posts/${category}?sort=${sort}&page=${page}`
    else url += `/posts?sort=${sort}&page=${page}`

    let res = await fetch(url)
    if (!res.ok) return alert('Something wrong!')
    res = await res.json()
    morePosts = res.more
    if (page > 0) {
      posts = posts.concat(res.posts)
    }
    else {
      posts = res.posts
    }
  }

  const fetchCategory = async (category) => {
    page = 0
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
<style>
  .load-more {
    text-align: center;
  }
</style>

{#if category}
<h4><a href={`/a/${category}`}>a/{category}</a></h4>
<p>{ categoryData.description }</p>
{:else if username}
<h4><a href={`/u/${username}`}>u/{username}</a></h4>

{/if}
<nav class="topnav">
  <Link to="{$activeRoute.uri}?sort=hot" on:click={ () => page = 0 }>Hot</Link>
  <Link to="{$activeRoute.uri}?sort=new" on:click={ () => page = 0 }>New</Link>
  <Link to="{$activeRoute.uri}?sort=top" on:click={ () => page = 0 }>Top</Link>
  <Link to="{$activeRoute.uri}?sort=comments" on:click={ () => page = 0 }>Comments</Link>
  <Link to="{$activeRoute.uri}?sort=not" on:click={ () => page = 0 }>Controversial</Link>
  <a href={`/api/1/${(username ? 'user' : 'posts' )}/${category || username ? (category || username)+'/' : ''}rss?sort=${sort}`}>RSS</a>
</nav>
{#each posts as post}
  <Post { post }></Post>
{/each}

{#if posts.length > 0 && morePosts}
  <div class="load-more">
    <button on:click={ () => page += 1 }>Load More</button>
  </div>
{/if}
