<script>
  import Post from './Post.svelte'
  import { userStore, currentCategory } from './store'

  export let username = null
  export let category = null
  let posts = []
  let sort = '-score';

  $: {    
    if (category) {
      document.title = `${category} - upvotocracy.com`
      currentCategory.set(category)
    }
    else {
      document.title = 'upvotocracy.com'
    } 
  }

  const fetchPost = async ({ username, category }) => {
    let url = 'API_BASE_URL'

    if (username) url += `/user/${username}?sort=${sort}`
    else if (category) url += `/posts/${category}?sort=${sort}`
    else url += `/posts?sort=${sort}`

    const res = await fetch(url)
    if (!res.ok) return alert('Something wrong!')
    posts = await res.json()
  }

  $: fetchPost({ username, category })

  let user
  userStore.subscribe(value => {
    if (value) {
      user = value
    }
  })

  function sortBy(type = 'hot') {
    if (type === 'hot') {
      sort = '-score'
    } else if (type === 'new') {
      sort = '-created'
    } else if (type === 'comments') {
      sort = '-score';
    } else if (type === 'not') {
      sort = '+score';
    }

    fetchPost({ username, category })
    
    posts = posts.sort((a, b) => {
      if (type === 'comments') {
        return b.comments.length - a.comments.length;
      }
    });
  }
</script>

<nav class="topnav">
  <a href="#hot" on:click|preventDefault={() => sortBy('hot')}>Hot</a>
  <a href="#new" on:click|preventDefault={() => sortBy('new')}>New</a>
  <a href="#comments" on:click|preventDefault={() => sortBy('comments')}>Comments</a>
  <a href="#hot" on:click|preventDefault={() => sortBy('not')}>Controversial</a>
  <a href={`/api/1/${(username ? 'user' : 'posts' )}/${category || username ? (category || username)+'/' : ''}rss?sort=${sort}`}>RSS</a>
</nav>
{#each posts as post}
  <Post { post }></Post>
{/each}
