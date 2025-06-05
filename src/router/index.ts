import { createRouter, createWebHistory } from 'vue-router'
import NewPrescriptionView from '../views/NewPrescriptionView.vue'
import PrescriptionsHistoryView from '@/views/PrescriptionsHistoryView.vue'
import VademecumView from '@/views/VademecumView.vue'
import PatientsManagementView from '@/views/PatientsManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: NewPrescriptionView
    },

    {
      path: '/prescription-history',
      component: PrescriptionsHistoryView
    },

    {
      path: '/vademecum',
      component: VademecumView
    },

    {
      path: '/patients',
      component: PatientsManagementView
    }
  ]
})

export default router
