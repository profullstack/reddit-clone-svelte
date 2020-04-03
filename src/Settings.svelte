<script>
import { navigate } from 'svelte-routing'
import { userStore } from './store'

let user
  userStore.subscribe(value => {
    user = value
  })

let isEditingFieldBT = false;
let isEditingFieldLinks = false;
let socialLinks = user.links

let numLinks = 1;
console.log(user)

const newLink = (event) => {
  event.preventDefault()
  if (numLinks < 3) {
    numLinks++
  }
  if (user.links.length > 0 && user.links.length < 3) {
    user.links.push({name: "", url: ""});
    socialLinks = user.links;
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

  for (i=0; i < numLinks; i++) {
    if (formData.get(`link-name${i}`) != "" && formData.get(`link-url${i}`) != "") {
      links.push({name: formData.get(`link-name${i}`), url: formData.get(`link-url${i}`)})
    }
  }

  console.log(links);
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
  return navigate('/')
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

$: fetchMe();

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
  {#if socialLinks.length > 0}
    <fieldset>
      <legend>Social Links</legend>
      {#each socialLinks as link} 
        <span>Link {socialLinks.indexOf(link) + 1}</span>
        <input type="text" placeholder="Name" name={`link-name${socialLinks.indexOf(link)}`} value={link.name} disabled={!isEditingFieldLinks}>
        <input type="text" placeholder="Url" name={`link-url${socialLinks.indexOf(link)}`} value={link.url} disabled={!isEditingFieldLinks}>
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