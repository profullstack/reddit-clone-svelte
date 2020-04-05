<script>
  import { Link, navigate } from 'svelte-routing'
  import moment from 'moment'
  import { userStore } from './store'
  const converter = new showdown.Converter({simplifiedAutoLink: true});

  export let post = {}
  export let withDetails = false
  let postThumb = null;
  let postVideo = null;
  let youtubeId = null;
  let nullvideo = null;

  const getThumb = (post) => {
    if (post.url && /\.(jpg|jpeg|png|gif)/.test(post.url.toLowerCase())) {
      postThumb = post.url;
    }
    else {
      postThumb = post.thumb;
    }
  }

  const getVideo = (post) => {
    if (post.url) {
      if (post.url.indexOf('youtube.com') > -1) {
        youtubeId = post.url.match(/v=([^&]*)/);
        postVideo = post.url;
      } else if (post.url.indexOf('youtu.be') > -1) {
        youtubeId = post.url.match(/youtu.be\/([^&\?]*)/);
        postVideo = post.url;
      } else if (post.url.indexOf('nullvideo') > -1) {
        postVideo = post.url.replace('/user/', '/uploads/') + '.mp4';
        postVideo = postVideo.replace(/(\?.*)/, '.mp4$1');
        nullvideo = postVideo;
      } else if (/\.(mp4|mov|m3u8)/.test(post.url.toLowerCase())) {
        postVideo = post.url;
      } else {
        youtubeId = null;
        postVideo = null;
      }
    }
  }

  $: {
    getThumb(post);
    getVideo(post);
  }

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

  .content .post-container .post-title h1 {
    font-size: 1.6rem;
    margin: 0;
    font-family: inherit;
    font-weight: 500;
    letter-spacing: inherit;
    line-height: normal;
  }

	.content .post-container .post-preview {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
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
    max-width: 100%;
    max-height: 50rem;
  }

  .youtube {
      display: block;
      position:relative;
      padding-bottom:56.25%;
      width: 100%;
      overflow: hidden;
  }

  .youtube iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
  }

  .mp4 {
      width: 100%;
      height: auto;
  }

  .withDetails .thumb {
    max-width: 100%;
    max-height: 100rem;
  }
</style>

<div class="content">
  <div class="voting-container">
    <span class="upvote-button"><span on:click={ upvote }>❮</span></span>
    <span>{ post.score }</span>
  {#if post.category.name !== 'Doge'}
    <span class="downvote-button"><span on:click={ downvote }>❯</span></span>
  {/if}
</div>

  <div class="post-container" class:withDetails>
    <div class="post-title">
      {#if withDetails}
        <h1><a href="{ post.url }" target="_blank">{ post.title }</a></h1>
      {:else}
       <a href={`/a/${post.category.name}/${post.id}`}>{ post.title }</a>
      {/if}
    </div>

    <div class="post-preview"> 
    {#if postThumb}
      {#if withDetails}
        {#if !postVideo}
        <a href="{ post.url }" target="_blank">
          <img class="thumb" src={postThumb} alt={post.title} />
        </a>  
        {/if}
      {:else}
        <a href={`/a/${post.category.name}/${post.id}`}>
          <img class="thumb" src={postThumb} alt={post.title} />
        </a>
      {/if}
    {/if}
    {#if postVideo}
      {#if withDetails}
        {#if youtubeId && youtubeId[1]}
        <div class="plyr__video-embed youtube">
            <iframe style="border: none;"
                src={`https://www.youtube.com/embed/${youtubeId[1]}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
                allowfullscreen
                allowtransparency
                title="YouTube"
            ></iframe>
        </div>
        {:else if nullvideo}
        <video class="mp4" poster={nullvideo.replace('.mp4', '.png')} id={`vid-${new Date().getTime()}`} playsinline controls crossorigin>
            <source src={nullvideo} type="video/mp4" />
        </video>
        {:else}
        <video class="mp4" poster={postVideo.replace('.mp4', '.png')} id={`vid-${new Date().getTime()}`} playsinline controls crossorigin>
            <source src={postVideo} type="video/mp4" />
        </video>
        {/if}
      {/if}
    {:else}
      {@html post.url || converter.makeHtml(post.text) } 
    {/if}
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
