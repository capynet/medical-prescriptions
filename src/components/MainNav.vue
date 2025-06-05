<script lang="ts" setup>
import {Edit, Collection, Avatar, Coin} from '@element-plus/icons-vue'
//import { useDark, useToggle } from '@vueuse/core'
//import { ref } from 'vue';
import {logOutCallback, user} from "@/composables/useFirebaseAuth";
import router from "@/router";
import {isDebug} from "@/composables/useUtils";

//const isDark = useDark()
//const switchIsDark = ref(isDark.value)
//const toggleDark = useToggle(isDark)

const logout = () => {
  logOutCallback()
  router.push('/')
}
</script>

<template>

  <ul class="main-menu sm:flex list-none items-center m-0 p-2 bg-slate-50">
    <li>

      <router-link
        to="/"
        class="flex items-center text-blue-700 text-xs p-3 no-underline"
      >
        <el-icon class="mr-2">
          <Edit/>
        </el-icon>

        <div>Crear receta</div>
      </router-link>

    </li>

    <li>
      <router-link
        to="/prescription-history"
        class="flex items-center text-blue-700 text-xs  p-3 no-underline"
      >
        <el-icon class="mr-2">
          <Collection/>
        </el-icon>
        <span>Histórico recetas</span>
      </router-link>
    </li>

    <li>
      <router-link
        to="/patients"
        class="flex items-center text-blue-700 text-xs  p-3 no-underline"
      >

        <el-icon class="mr-2">
          <Avatar/>
        </el-icon>

        <span>Pacientes</span>
      </router-link>
    </li>

    <li>
      <router-link
        to="/vademecum"
        class="flex items-center text-blue-700 text-xs  p-3 no-underline"
      >

        <el-icon class="mr-2">
          <Coin/>
        </el-icon>

        <span>Vademecum</span>
      </router-link>
    </li>

    <li v-if="isDebug">
      <h3 class="bg-red-900 text-white p-2">[SITIO DE DESARROLLO, NO USAR]</h3>
    </li>

    <li class="flex-grow"></li>

    <li class="flex items-center text-xs border-2 p-3 ">
      <!--   <el-avatar
          class="mr-2"
          :size="40"
          :src="(user?.photoURL as string)"
          :alt="user?.displayName as string"
      >
      </el-avatar>
-->

      <span class="text-xs">{{ user?.displayName }}&nbsp;&nbsp;</span>

      <a
        href="#"
        @click="logout"
        class="text-blue-700 no-underline"
      >
        (<strong>Cerrar sesión</strong>)
      </a>
    </li>

  </ul>

</template>

<style>
.main-menu a:hover {
  transition: all 400ms;
}

.main-menu a:hover {
  background-color: #ebebeb;
}

a.router-link-active {
  background-color: #ebebeb;
}
</style>