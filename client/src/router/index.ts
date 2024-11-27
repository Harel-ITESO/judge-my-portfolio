import MainView from '@/views/main/MainView.vue'
import Login from '@/views/auth/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/auth/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'
import UserView from '@/views/user/UserView.vue'
import PostCreateView from '@/views/posts/create/PostCreateView.vue'
import PostsDetailView from '@/views/posts/detail/PostDetailView.vue'
import NotFoundView from '@/views/not-found/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/not-found',
      meta: { layout: 'main', requiresAuth: false },
      component: NotFoundView,
    },

    {
      path: '/',
      name: 'Main page',
      meta: { layout: 'main', requiresAuth: false },
      component: MainView,
    },

    {
      path: '/user',
      name: 'Page of a user',
      meta: { layout: 'main', requiresAuth: true },
      children: [
        {
          path: ':username',
          component: UserView,
        },
      ],
    },

    {
      path: '/posts',
      name: 'Posts',
      meta: { layout: 'main', requiresAuth: true },
      redirect: '/posts/create',
      children: [
        {
          path: 'create',
          component: PostCreateView,
        },
        {
          path: ':id/detail',
          component: PostsDetailView,
        },
      ],
    },

    {
      path: '/authentication',
      name: 'Authentication',
      meta: { layout: 'auth', requiresAuth: false },
      redirect: '/authentication/login',
      children: [
        {
          path: 'login',
          component: Login,
        },
        {
          path: 'register',
          component: Register,
        },
      ],
    },

    /** Default redirect if route doesn't exist */
    {
      path: '/:pathMatch(.*)*',
      redirect: '/not-found',
    },
  ],
})

/**
 * Authentication
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const { valid } = await authStore.validateSession() // always validate the session in the beginning
  if (!to.meta.requiresAuth) return next() // if the route doesn't require authentication, continue
  if (!valid) return next('/authentication/login') // redirect to 'login' if the user is not authenticated
  return next()
})

export default router
