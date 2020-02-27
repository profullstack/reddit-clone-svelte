<script>
  import { Link, navigate } from 'svelte-routing'
  import moment from 'moment'
  import { userStore } from './store'
  const converter = new showdown.Converter({simplifiedAutoLink: true});

  export let post = {}
  export let withDetails = false
  let postThumb = null;

  const getThumb = (post) => {
    if (post.url && /\.(jpg|jpeg|png|gif)/.test(post.url.toLowerCase())) {
      postThumb = post.url;
      console.log(postThumb, 'postThumb');
    }
    else {
      postThumb = null;
    }
  }

  $: getThumb(post);

  let user = {}
  userStore.subscribe(value => {
    if (value) user = value
  })

  const vote = async (state) => {
    const url = `API_BASE_URL/post/${post.id}/${state}`
    const token = localStorage.getItem('token')

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) alert('Invalid credentials')
    const data = await res.json()
    post.score = data.score
    post.upvotePercentage = data.upvotePercentage
  }

  const upvote = () => vote('upvote')
  const downvote = () => vote('downvote')

  const removePost = async () => {
    const url = `API_BASE_URL/post/${post.id}`
    const token = localStorage.getItem('token')

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) alert('Something went wrong')
    return navigate('/')
  }
</script>

<style>
	.content {
    display: grid;
    grid-template-columns: 4em auto;
  }
  .content .post-container {
    width: 100%;
  }
  .content .voting-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .3em 0;
    font-size: 14px;
    line-height: 1.5em;
    font-weight: 400;
    text-align: center;
    justify-self: center;
  }
  .content .voting-container .upvote-button,
  .content .voting-container .downvote-button {
    transform: rotate(90deg);
    cursor: pointer;
  }
	.content .post-container .post-preview {
    font-size: 14px; 
	}
	.content .post-container .post-detail {
		font-size: 14px;
  }
  .content .post-container .post-metadata {
		font-size: 12px;
  }
  .separator {
    margin-bottom: 1.5em;
  }
  .remove-button {
    cursor: pointer;
  }

  .thumb {
    display: block;
    width: 50%;
  }
</style>

<div class="content">
  <div class="voting-container">
    <span class="upvote-button"><span on:click={ upvote }>❮</span></span>
    <span>{ post.score }</span>
    <span class="downvote-button"><span on:click={ downvote }>❯</span></span>
  </div>

  <div class="post-container">
    <div class="post-title">
      <a href="{ post.url }" target="_blank">{ post.title }</a>
    </div>

    <div class="post-preview">
    {#if postThumb}<img class="thumb" src={postThumb} alt={post.title} />{/if}
    {@html post.url || converter.makeHtml(post.text) } 
    </div>

    <div class="post-detail" class:separator={ !withDetails }>
      <Link to="/a/{ post.category.name }/{ post.id }">{ post.comments.length } comments</Link> ·
      <Link to="/a/{ post.category.name }">/a/{ post.category.name }</Link> ·
      <span>by</span>
      <Link to="/u/{ post.author.username }">{ post.author.username }</Link> ·
      <span>{ moment(post.created).fromNow() }</span>
    </div>

    {#if withDetails}
      <div class="post-metadata">
        <span>{ post.views } views</span> · <span>{ post.upvotePercentage }% upvoted</span>
        {#if post.author.id === user.id }
          <span id={ post.id } class="remove-button float-right" on:click={ removePost }>Delete</span>
        {/if}
      </div>
      <hr>
    {/if}
  </div>
</div>
