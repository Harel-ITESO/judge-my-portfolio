<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const { isAuthenticated, userInformation, logOut } = useAuthStore()
import Swal from 'sweetalert2'

async function handleLogout() {
  Swal.fire({
    title: 'Sign out',
    text: 'Are you sure you want to sign out?',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#000000',
    showCancelButton: true,
    icon: 'warning',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await logOut()
      window.location.reload()
    }
  })
}
</script>

<template>
  <header>
    <nav class="bg-black text-white w-full p-4 flex justify-between items-center">
      <h1 class="text-2xl">
        <RouterLink to="/" class="hover:text-neutral-200 transition-all">
          <i class="fa-solid fa-code -rotate-45 text-red-500"></i>Judge My Portfolio
        </RouterLink>
      </h1>
      <div id="currentUserProfilePic" class="relative block dropdown dropdown-bottom dropdown-end">
        <button class="rounded-full transition-all" role="button">
          <div class="avatar">
            <div class="w-16 rounded-full">
              <template v-if="isAuthenticated">
                <img :src="userInformation?.profilePicUrl" v-if="userInformation?.profilePicUrl" />
                <span
                  v-else
                  class="bg-white text-black w-full h-full flex text-xs items-center justify-center"
                  >{{ userInformation?.username }}</span
                >
              </template>
              <template v-else>
                <img src="/default_user.jpg" />
              </template>
            </div>
          </div>
        </button>
        <!-- If the user is authenticated, change the dropdown -->
        <ul
          v-if="isAuthenticated"
          tabindex="0"
          class="dropdown-content menu bg-primary text-white rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <RouterLink :to="`/user/${userInformation?.username}`"
              ><i class="fa-solid fa-user"></i> Profile</RouterLink
            >
          </li>
          <li>
            <button @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i> Log-out
            </button>
          </li>
        </ul>
        <ul
          v-else
          tabindex="0"
          class="dropdown-content menu bg-primary text-white rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <RouterLink to="/authentication/login"
              ><i class="fa-solid fa-right-to-bracket"></i> Sign In</RouterLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
