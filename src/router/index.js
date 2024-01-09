import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginComponent from '../components/LoginComponent.vue'
import RegisterComponent from '../components/RegisterComponent.vue'
import MyPostComponent from "../components/MyPostsComponent.vue"
import PostDetailComponent from "../components/PostDetailComponent.vue"

/**
 * Vue Router builder function.
 * @function
 * @name createRouter
 * 
 * @property {string} path - Route URL.
 * @property {string} name - Route name.
 * @property {Object} component - Route component.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterComponent
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '/my-posts',
      name: 'my-posts',
      component: MyPostComponent
    },
    {
      path: '/post-detail/:id',
      name: 'post-detail',
      component: PostDetailComponent
    },
  ]
})

export default router
