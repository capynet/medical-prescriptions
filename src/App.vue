<script setup lang="ts">
import {RouterView} from 'vue-router'
import {useCentralStore} from '@/stores/centralStore';
import {onMounted} from 'vue';
import {isAuthenticated} from "@/composables/useFirebaseAuth";
import LoginScreen from '@/components/LoginScreen.vue';
import PrescriptionPDFTemplate from "@/components/prescriptions/PrescriptionPDFTemplate.vue";
import {isDebug} from "@/composables/useUtils";

const store = useCentralStore()

onMounted(() => {
  document.addEventListener("keydown", function (e) {
    if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
    }
  }, false);
})

store.commonInstructions = [
  {
    label: 'Cada 8 horas',
    value: ''
  },
  {
    label: 'Cada 12 horas',
    value: ''
  },
  {
    label: 'Por las mañanas una vez al día en ayunas',
    value: ''
  }
]

//supabase.from('patient').select(`*, author(*), affiliationProvider(*)`).then(r => console.log(r.data))

// supabase.from('patient').insert([{
//   userId: '30654234',
//   affiliationId: '564894',
//   affiliationProvider: 1,
//   author: 1,
//   fullName: 'Marcelo 2',
// }]).then(r => console.log(r.data))

if(isDebug){
  console.warn(`Corriendo en desarrollo: ${import.meta.env.VITE_SUPABASE_URL}`);
}
</script>

<template>

  <template v-if="!isAuthenticated">
    <LoginScreen/>
  </template>

  <template v-else>

    <!-- Out of screen component needed for rendering PDF's -->
    <PrescriptionPDFTemplate/>

    <div class="common-layout p-3">

      <header>
        <MainNav/>
      </header>

      <main>
        <RouterView/>
      </main>

    </div>

  </template>

</template>
