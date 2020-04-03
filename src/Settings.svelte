<script>
import { navigate } from 'svelte-routing'
import { userStore } from './store'
import { onMount } from 'svelte'

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
   if (user.links.length > 0 && user.links.length <= 3) {
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
    if (formData.get(`link-name${i}`) != "" && formData.get(`link-url${i}`) != "" && formData.get(`link-name${i}`) != null && formData.get(`link-url${i}`) != null) {
      links.push({name: formData.get(`link-name${i}`), url: formData.get(`link-url${i}`)})
    }
  }
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
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress" value={user.bitcoinAddress}> 
    {:else}
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress">
    {/if}
  </fieldset>
</form>



<form id="links">
  {#if user.links.length > 0}
    <fieldset>
      <legend>Social Links</legend>
      {#each user.links as link} 
        <span>Link {user.links.indexOf(link) + 1}</span>
<<<<<<< fad03c174e8076e6f072d008c5bf36a3f9f61789
<<<<<<< fb928b2e242eae5e3dde0f8ef71cf582351d2e30
<<<<<<< 1f9871809d58dad65d6aedf8382a183f9f7155dc
        {#if isEditingFieldLinks} <a href="#" class="float-right" on:click={(e) => deleteLink(e, user.links.indexOf(link))}>Delete</a> {/if}
=======
>>>>>>> Removed log statements, reload on submit, fixed links bug
=======
        {#if isEditingFieldLinks} <a href="#" class="float-right" on:click={(e) => deleteLink(e, user.links.indexOf(link))}>Delete</a> {/if}
>>>>>>> Added delete option
        <input type="text" placeholder="Name" name={`link-name${user.links.indexOf(link)}`} value={link.name} disabled={!isEditingFieldLinks}>
        <input type="text" placeholder="Url" name={`link-url${user.links.indexOf(link)}`} value={link.url} disabled={!isEditingFieldLinks}>
=======
        <a href="#" class="float-right" on:click={(e) => deleteLink(e, user.links.indexOf(link))}>Delete</a>
        <input type="text" placeholder="Name" name={`link-name${user.links.indexOf(link)}`} value={link.name}>
        <input type="text" placeholder="Url" name={`link-url${user.links.indexOf(link)}`} value={link.url}>
>>>>>>> Single save button
      {/each}
        <button class="button-primary float-right" on:click={newLink}>New Link</button>
    </fieldset>
{:else}
    <fieldset>
      <legend>Social Links</legend>
      {#each Array(numLinks) as _, i}
        <input type="text" placeholder="Name" name={`link-name${i}`}>
        <input type="text" placeholder="Url" name={`link-url${i}`}> 
      {/each}
      <button class="button-primary" on:click={newLink}>New Link</button>
    </fieldset>
    {/if}
</form>

<button class="button-primary" type="submit" on:click={(e) => {updateLinks(e); updateBT(e); return location.reload();}}>Save</button>

{/if}
</div>