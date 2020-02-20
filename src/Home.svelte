<script>
  import Post from './Post.svelte'
  import { userStore } from './store'

  export let username = null
  export let category = null
  let posts = []

  if (category) {
    document.title = `${category} - upvotocracy.com`
  }

  const fetchPost = async ({ username, category }) => {
    let url = 'API_BASE_URL'

    if (username) url += `/user/${username}`
    else if (category) url += `/posts/${category}`
    else url += '/posts'

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
</script>

<div class="">
  <div class="">
    {#each posts as post}
      <Post { post }></Post>
    {/each}
  </div>
</div>
