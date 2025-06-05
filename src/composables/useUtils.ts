import type ObraSocial from '@/models/ObraSocial'
import { ref } from 'vue'

export default function useUtils() {
  const obrasSociales = ref<ObraSocial[]>([
    {
      label: "O.S.S.U.R.R.Ba.C",
      value: "ossurrbac"
    },
    {
      label: "O.S.P.J.T.A.P",
      value: "ospjtap"
    },
    {
      label: "OSPEVIC",
      value: "ospevic"
    },
    {
      label: "OSPLYFC",
      value: "osplyfc"
    }
  ])

  return {
    obrasSociales,
  }
}

export const isDebug = import.meta.env.VITE_DEBUG_ENABLED === "true"
