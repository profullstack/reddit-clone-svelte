<script>
	import '../node_modules/milligram/dist/milligram.min.css'
	import { Router, Route } from 'svelte-routing'

	import Navbar from './Navbar.svelte'
	import Home from './Home.svelte'
	import Login from './Login.svelte'
	import Signup from './Signup.svelte'
	import Detail from './Detail.svelte'
	import PostForm from './PostForm.svelte'
	import CategoryForm from './CategoryForm.svelte'
	import Sidebar from './Sidebar.svelte'
	import Inbox from './Inbox.svelte'
</script>

<style>
	:global(.row) {
	  justify-content: center;
	}
	:global(a) {
		color: #13d583;
		font-weight: 500;
	}

	:global(button) {
		background-color: #13d583;
		border-color: #13d583;
	}

	:global(.button.button-outline, button.button-outline){
		border-color: #13d583;
		color: #13d583;
	}

	:global(input[type="radio"].toggle:checked+label){
		color: #13d583;
	}

	:global(input[type='text']:focus, textarea:focus, select:focus) {
		border-color: #13d583;
	}

	:global(input[type="radio"].toggle+label:after) {
		border-bottom-color: #13d583;
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
		margin-top: 20px;
		word-wrap: anywhere;
	}

	footer {
		font-size: 1.2rem;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
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
			</div>
		</div>
		<footer>
			<a href="https://upvotocracy.com/api/1/posts/rss">RSS</a>
			<a href="https://nullvideo.com">nullvideo.com</a>
			<a href="https://virusoutbreak.wtf">VirusOUTBREAK</a>
			<a href="https://profullstack.com">Profullstack.com</a>
			<span class="legal">&copy; 2020</span>
		</footer>
	</div>
</Router>
