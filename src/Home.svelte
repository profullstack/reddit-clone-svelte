<script>
  import Post from './Post.svelte'
  import { Link } from 'svelte-routing'
  import { onMount, getContext } from 'svelte'
  import { userStore, currentCategory } from './store'
  import {ROUTER} from 'svelte-routing/src/contexts';
  import { abbreviateNumber } from './utils/abbreviateNumber';
  import { timeSince } from './utils/time';
  import { addSubscription, removeSubscription } from './editSubscriptions';

  const { activeRoute } = getContext(ROUTER);

  export let username = null
  export let category = null
  export let subscriptions = null
  let posts = []
  let sort
  let type = 'hot'
  let categoryData = {}
  let page = 0
  let morePosts

  let currentCat
  currentCategory.subscribe(value => {
    currentCat = value
  })

  let user
  let pageUser

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
    sorter()

    let url = 'API_BASE_URL'
    let headers

    if (username) url += `/user/${username}?sort=${sort}&page=${page}`
    else if (category) url += `/posts/${category}?sort=${sort}&page=${page}`
    else if (subscriptions) {
      const token = localStorage.getItem('token')
      headers = { Authorization: `Bearer ${token}` }
      url += `/subscriptions?sort=${sort}&page=${page}`
    }
    else url += `/posts?sort=${sort}&page=${page}`

    let res = await fetch(url, { headers })
      .catch(console.error);
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
    if (!category) return;
    page = 0
    let url = 'API_BASE_URL' + `/category/${category}`

    const res = await fetch(url)
    .catch(console.error)
    if (!res.ok) return alert('Failed to fetch category info!')
    categoryData = await res.json()
  }

  const fetchUser = async (username) => {
    if (!username) return;

    let url = 'API_BASE_URL' + `/users/${username}`

    const res = await fetch(url)
    .catch(console.error);
    if (!res.ok) return alert('Failed to fetch user info!')
    pageUser = await res.json()
  }

  const fetchMe = async () => {
    if (!user) return;
    let url = 'API_BASE_URL/me';
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(console.error);

    if (!res.ok) return alert('Failed to fetch user info!')
    user = await res.json();
    userStore.set(user);
  }

const sorter = () => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('sort')) type = urlParams.get('sort')
    
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

    sort = encodeURIComponent(sort)
    return true;
  }

  $: fetchPost({ type, username, category, page, $activeRoute })
  $: fetchCategory(category)
  $: fetchUser(username);
  $: fetchMe();
</script>
<style>
  .load-more {
    text-align: center;
  }
  .topnav {
    margin: 1rem;
  }
  .topnav a {
    margin-right: .5rem;
  }
  .category {
    margin-bottom: 0.8rem;
  }
  .subscriber-count {
    font-size: 1.8rem;
  }
</style>

{#if category}
  <h4 class="category">
    <a href={`/a/${category}`}>a/{category}</a> · 
    <span class="subscriber-count">{ categoryData.subscriberCount || 0 } { categoryData.subscriberCount == 1 ? 'Subscriber' : 'Subscribers'}</span>
  </h4>
  {#if user}
    {#if user.subscriptions && user.subscriptions.includes(categoryData._id)}
      <button href="javascript:void(0)" on:click={() => removeSubscription(categoryData._id)}>Leave</button>
    {:else}
      <button href="javascript:void(0)" on:click={() => addSubscription(categoryData._id)}>Join</button>
    {/if}
  {/if}
  <div>{ categoryData.description }</div>
  {#if categoryData.owner}
    <div>Created by <a href={`/u/${categoryData.owner.username}`}>{ categoryData.owner.username }</a> {timeSince(categoryData.created)} ago.</div>
  {/if}
{:else if pageUser}
  <h4>
    <a href={`/u/${pageUser.username}`}>u/{pageUser.username} ({abbreviateNumber(pageUser.karma || 0)})</a>
  </h4>
  <div class="bio">
    {#if pageUser.bitcoinAddress}
    <div>Bitcoin: <a href={`bitcoin:${pageUser.bitcoinAddress}`}>{pageUser.bitcoinAddress}</a></div>
    {/if}
    {#if pageUser.links.length}
    <div>Links:</div>
    <ul class="links">
      {#each pageUser.links as link}
        <li><a href={link.url} target="_new">{link.name}</a></li>
      {/each}
    </ul>
    {/if}
  </div>
  {#if pageUser.created}
  <p>Joined {timeSince(pageUser.created)} ago</p>
  {/if}
{/if}

<nav class="topnav">
  <Link to="{$activeRoute.uri}?sort=hot" on:click={ () => page = 0 }>Hot</Link>
  <Link to="{$activeRoute.uri}?sort=new" on:click={ () => page = 0 }>New</Link>
  <Link to="{$activeRoute.uri}?sort=top" on:click={ () => page = 0 }>Top</Link>
  <Link to="{$activeRoute.uri}?sort=comments" on:click={ () => page = 0 }>Comments</Link>
  <Link to="{$activeRoute.uri}?sort=not" on:click={ () => page = 0 }>Controversial</Link>
  {#if subscriptions}
    <a href={`/api/1/posts/rss/${user.id}`}>RSS</a>
  {:else}
    <a href={`/api/1/${(username ? 'user' : 'posts' )}/${category || username ? (category || username)+'/' : ''}rss?sort=${sort}`}>RSS</a>
  {/if}
</nav>
{#each posts as post}
  <Post { post }></Post>
{/each}

{#if posts.length > 0 && morePosts}
  <div class="load-more">
    <button on:click={ () => page += 1 }>Load More</button>
  </div>
{/if}