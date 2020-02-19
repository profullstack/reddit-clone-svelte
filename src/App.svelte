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
</script>

<style>
	.container {
		max-width: 800px;
	}
</style>

<Router>
	<div class="container">
		<Navbar></Navbar>
		<div>
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
</Router>
