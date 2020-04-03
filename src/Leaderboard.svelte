<h1>Leaderboard</h1>

<ol>
{#each leaders as user}
    <li>
        <a href="/u/{user.username}">{user.username}</a> {user.karma}
        {#if user.created}
            <span class="meta">Joined {timeSince(user.created)} ago</span>
        {/if}
        {#if user.bitcoinAddress}
            <span class="bitcoin">Bitcoin: <a href="bitcoin:{user.bitcoinAddress}">{user.bitcoinAddress}</a></span>
        {/if}
    </li>
{/each}
</ol>

<script>

import { onMount } from 'svelte';
import { abbreviateNumber } from './utils/abbreviateNumber';
import { timeSince } from './utils/time';

let leaders = [];

function getLeaderBoard(){
    return fetch('API_BASE_URL/leaderboard')
        .then(async res => {
            if (res.ok) {
                return await res.json();
            } else {
                throw res;
            }
        })
        .catch(console.error);
}

onMount(async () => {
    const res = await getLeaderBoard()
        .catch(console.error);

    if (res) {
        leaders = res.leaders;
    }
})
</script>