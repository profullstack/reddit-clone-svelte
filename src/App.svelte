<script>
	import '../node_modules/milligram/dist/milligram.min.css'
	import { Router, Route } from 'svelte-routing'
	import { onMount } from 'svelte';

	import Navbar from './Navbar.svelte'
	import Home from './Home.svelte'
	import Login from './Login.svelte'
	import Signup from './Signup.svelte'
	import Detail from './Detail.svelte'
	import PostForm from './PostForm.svelte'
	import CategoryForm from './CategoryForm.svelte'
	import Sidebar from './Sidebar.svelte'
	import Inbox from './Inbox.svelte'
	import Leaderboard from './Leaderboard.svelte';
	import Settings from './Settings.svelte'


	onMount(async () => {
		document.getElementById('bookmarklet').setAttribute('href', "javascript:void(open(`https://upvotocracy.com/compose?link=${encodeURIComponent(`${location.href}${location.href.includes('?')?'&':'?'}_snoorandom=${crypto.getRandomValues(new Uint8Array(4)).reduce((a,v)=>a+=(v.toString(16).padStart(2,'0')),'')}`)}&title=${encodeURIComponent(document.querySelector('meta[name=title][content]')?document.querySelector('meta[name=title][content]').content:document.title)}`))");
	});


</script>

<style>
	:global(.row) {
	  justify-content: center;
	}
	:global(a) {
		color: #147b50;
		font-weight: 500;
	}

	:global(button) {
		background-color: #147b50;
		border-color: #147b50;
	}

	:global(.button.button-outline, button.button-outline){
		border-color: #147b50;
		color: #147b50;
	}

	:global(input[type="radio"].toggle:checked+label){
		color: #147b50;
	}

	:global(input[type='text']:focus, textarea:focus, select:focus) {
		border-color: #147b50;
	}

	:global(input[type="radio"].toggle+label:after) {
		border-bottom-color: #147b50;
	}

	.container {
		max-width: 70%;
	}
	.main {
		width: 100%;
		display: flex;
		justify-content: flex-start;
	}
	.content {
		margin-top: 2rem;
		padding: 1rem;
		word-wrap: anywhere;
		width: 100%;
	}

	footer {
		font-size: 1.2rem;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		flex-wrap: wrap;
		margin: 2rem;
	}

	footer > * {
		margin-left: 1rem;
	}

	@media only screen and (max-width: 1250px) {
    .container {
      max-width: 100%;
      padding: 0px;
    }
    :global(.row) {
    	max-width: 90%;
    }
  }
</style>

<Router>
	<div class="container">
		<Navbar></Navbar>
		<div class="main">
			<Sidebar></Sidebar>
			<div class="content">
				<Route path="/" component={ Home } />
				<Route path="/login" component={ Login } />
				<Route path="/register" component={ Signup } />
				<Route path="/u/:username" component={ Home } />
				<Route path="/a/:category" component={ Home } />
				<Route path="/a/:category/:postId" component={ Detail } />
				<Route path="/compose" component={ PostForm } />
				<Route path="/newcategory" component={ CategoryForm } />
				<Route path="/inbox" component={ Inbox } />
				<Route path="/leaderboard" component={ Leaderboard } />
				<Route path="/settings" component={ Settings } />
				<Route path="/home" subscriptions={true} component={ Home } />
				<footer>
					<a href="/leaderboard">Leaderboard</a>
					<a id="bookmarklet" href="#" title="Drag to bookmark bar">Bookmarklet</a>
					<a href="https://upvotocracy.com/api/1/posts/rss">RSS</a>
					<a href="mailto:hello@upvotocracy.com?subject=Upvotocracy">hello@upvotocracy.com</a>
					<a href="https://github.com/profullstack/reddit-clone-svelte" title="MIT">open source</a>
					<a href="https://www.facebook.com/pg/upvoGoCrazy/" title="Facebook: upvoGoCrazy">Facebook</a>
					<a href="https://nullvideo.com">nullvideo.com</a>
					<a href="https://virusoutbreak.wtf">VirusOUTBREAK</a>
					<a href="https://theultimateprepper.com">The Ultimate Prepper</a>
					<a href="https://profullstack.com">Profullstack.com</a>
					<span class="legal">&copy; 2020</span>
				</footer>
			</div>
		</div>
	</div>
</Router>
