<script>
import { navigate } from 'svelte-routing'
import { userStore } from './store'

let user
$: fetchMe();
let isEditingFieldBT = false;
let isEditingFieldLinks = false;
let numLinks = 1;

const newLink = (event) => {
  event.preventDefault()
  if (numLinks < 3) {
    numLinks++
  }
  if (user.links.length > 0 && user.links.length < 3) {
    user.links.push({name: "", url: ""});
    user.links = user.links;
  }
}

const deleteLink = (e, i) => {
  e.preventDefault();
   if (user.links.length > 0 && user.links.length < 3) {
    if (i > -1) {
      user.links.splice(i, 1);
      user.links = user.links;
    }
  }
}

const updateBT = async (event) => {
  event.preventDefault()
  const form = document.getElementById('settings')
  const token = localStorage.getItem('token')
  const formData = new FormData(form)
  form.reset()

  const url = 'API_BASE_URL/me/bitcoinaddress'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bitcoinaddress: formData.get('bitcoinAddress')
    })
  })

  if (!res.ok) alert('Something went wrong!')
}

const updateLinks = async (event) => {
  event.preventDefault()
  const form = document.getElementById('links')
  const token = localStorage.getItem('token')
  const formData = new FormData(form)
  form.reset()
  let links = []

  for (i=0; i < Math.max(numLinks, user.links.length); i++) {
    if (formData.get(`link-name${i}`) != "" && formData.get(`link-url${i}`) != "") {
      links.push({name: formData.get(`link-name${i}`), url: formData.get(`link-url${i}`)})
    }
  }
  console.log(numLinks, user.links.length)
  const url = 'API_BASE_URL/me/links'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      socialLinks: links
    })
  })

  if (!res.ok) alert('Something went wrong!')
  return location.reload();
}

  const fetchMe = async () => {
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

</script>

<div>
{#if user}
<form id="settings">
  <fieldset>
    <legend>Bitcoin Address</legend>
    {#if user.bitcoinAddress != null}
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress" value={user.bitcoinAddress} disabled={!isEditingFieldBT}> 
      {#if !isEditingFieldBT}
        <button class="btn button-primary float-right" on:click={(e) => {e.preventDefault(); isEditingFieldBT = !isEditingFieldBT}}>Edit</button>
      {:else}
        <button class="button-primary float-right" type="submit" on:click={ updateBT }>Submit</button>
      {/if}
    {:else}
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress">
      <button class="button-primary float-right" type="submit" on:click={ updateBT }>Submit</button>
    {/if}
  </fieldset>
</form>



<form id="links">
  {#if user.links.length > 0}
    <fieldset>
      <legend>Social Links</legend>
      {#each user.links as link} 
        <span>Link {user.links.indexOf(link) + 1}</span>
        {#if isEditingFieldLinks} <a href="#" class="float-right" on:click={(e) => deleteLink(e, user.links.indexOf(link))}>Delete</a> {/if}
        <input type="text" placeholder="Name" name={`link-name${user.links.indexOf(link)}`} value={link.name} disabled={!isEditingFieldLinks}>
        <input type="text" placeholder="Url" name={`link-url${user.links.indexOf(link)}`} value={link.url} disabled={!isEditingFieldLinks}>
      {/each}
      {#if !isEditingFieldLinks}
        <button class="button-primary float-right" type="submit" on:click={(e) => {e.preventDefault(); isEditingFieldLinks = !isEditingFieldLinks}}>Edit</button>
      {:else}
        <button class="button-primary" on:click={newLink}>New Link</button>
        <button class="button-primary float-right" type="submit" on:click={updateLinks}>Submit</button>
      {/if}
    </fieldset>
{:else}
    <fieldset>
      <legend>Social Links</legend>
      {#each Array(numLinks) as _, i}
        <input type="text" placeholder="Name" name={`link-name${i}`}>
        <input type="text" placeholder="Url" name={`link-url${i}`}> 
      {/each}
      <button class="button-primary" on:click={newLink}>New Link</button>
      <button class="button-primary float-right" type="submit" on:click={updateLinks}>Submit</button>
    </fieldset>
    {/if}
</form>


{/if}

</div>