<script>
  import Post from './Post.svelte'
  import Comment from './Comment.svelte'
  import CommentForm from './CommentForm.svelte'
  import { userStore } from './store'

  export let category = null
  export let postId = null
  let post = null

  let user
  userStore.subscribe(value => {
    user = value
  })

  const fetchPost = async ({ postId }) => {
    const url = `API_BASE_URL/post/${postId}`

    const res = await fetch(url)
    if (!res.ok) return alert('Something wrong!')
    post = await res.json()
    document.title = `${post.title} - upvotocracy.com`
  }

  $: fetchPost({ postId })

  const updateComment = (event) => {
    post = event.detail
  }
</script>

<style>
  .post-body {
    grid-column-start: span 2;
  }
  .post-meta {
    grid-column: 2;
  }
</style>

{#if post}
<div class="post-body">
  <Post { post } withDetails={ true }></Post>
</div>
<div class="post-meta">
  {#if user}
    <CommentForm id={ post.id } on:update-comment={ updateComment }></CommentForm>
  {/if}
  <Comment id={ post.id } comments={ post.comments } on:update-comment={ updateComment }></Comment>
</div>
{/if}
