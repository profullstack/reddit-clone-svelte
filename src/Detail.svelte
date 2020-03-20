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


  function setMetaTags(post){
    document.querySelector('meta[name="description"]').setAttribute("content", post.text || post.title);
    document.querySelector('meta[property="og:description"]').setAttribute("content", post.text || post.title);
    document.querySelector('meta[property="og:title"]').setAttribute('content', post.title);
    document.querySelector('meta[property="og:url"]').setAttribute('content', `BASE_URL/a/${post.category.name}/${post.id}`);
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', post.title);
    document.querySelector('meta[name="twitter:url"]').setAttribute('content', `BASE_URL/a/${post.category.name}/${post.id}`);
    
    if (post.thumb) {
      document.querySelector('meta[property="og:image"]').setAttribute('content', post.thumb);
      document.querySelector('meta[property="twitter:image"]').setAttribute('content', post.thumb);
    }
  }

  const fetchPost = async ({ postId }) => {
    const url = `API_BASE_URL/post/${postId}`

    const res = await fetch(url)
    if (!res.ok) return alert('Something wrong!')
    post = await res.json()
    document.title = `${post.title} - upvotocracy.com`
    setMetaTags(post);
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
  {#if category}
  <h4><a href={`/a/${category}`}>a/{category}</a></h4>
  {/if}
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
