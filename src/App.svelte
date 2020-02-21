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
</script>

<style>
	:global(.row) {
	  justify-content: center;
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
			</div>
		</div>
	</div>
</Router>
