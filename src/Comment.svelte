<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import moment from 'moment'
  import { userStore } from './store'
  const converter = new showdown.Converter({simplifiedAutoLink: true});

  export let id, comments
  const dispatch = createEventDispatcher()

  let user = {}
  userStore.subscribe(value => {
    if (value) user = value
  })

  const removeComment = async (event) => {
    event.preventDefault()
    const { srcElement: { id: commentId } } = event

    const url = `API_BASE_URL/post/${id}/${commentId}`
    const token = localStorage.getItem('token')

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) alert('Something went wrong!')
    const post = await res.json()
    dispatch('update-comment', post)
  }

  let highlighted

  const highlightComment = async () => {
    const url = window.location.href
    const split = url.split('#')
    console.log(split[1])
    highlighted = split[1]
  }

  onMount(() => {
    highlightComment()
  })
</script>

<style>
  .content {
    width: 100%;
  }
  .comment-container {
    margin-bottom: 1em;
  }
  .comment-metadata {
    font-size: 12px;
  }
  .comment-body {
    font-size: 14px;
  }
  .comment-highlighted {
    background-color: #d7fded;
  }
  .remove-button {
    cursor: pointer;
  }
</style>

<div class="content">
  {#each comments as comment}
    <div class="comment-container" id="{comment.id}" class:comment-highlighted={highlighted === comment.id}>
      <div class="comment-metadata">
        <span>{ comment.author.username }</span> · <span>{ moment(comment.created).fromNow() }</span>
        {#if comment.author.id === user.id }
          <span id={ comment.id } class="remove-button float-right" on:click={ removeComment }>Delete</span>
        {/if}
      </div>
      <div class="comment-body">
        <span>{@html converter.makeHtml(comment.body) }</span>
      </div>
    </div>
  {/each}
</div>
