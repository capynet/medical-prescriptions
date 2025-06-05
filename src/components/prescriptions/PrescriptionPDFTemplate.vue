<script setup lang="ts">
import { useCentralStore } from '@/stores/centralStore';
import dayjs from 'dayjs';
const store = useCentralStore()

const cleanCreatedAt = (created_at: string) => {
  const createdAt = dayjs.utc(created_at)
  const createdAtFormattedH = createdAt.format('DD/MM/YYYY')
  const createdAtFormattedM = createdAt.format('HH:mm')
  return {
    createdAtFormattedH,
    createdAtFormattedM
  }
}

const currentDate = dayjs.utc(new Date()).tz()
const currentDate1MonthLater = currentDate.add(1, 'month').format('DD/MM/YYYY')

</script>

<template>

    <div class="prescription-pdf-template">

        <div class="heading">

            <div class="patient-details">
                <h2>Paciente</h2>

                <div>

                    <div>
                        <h4>Apellido y Nombre: <span>{{ store.currentPDFInfo?.patient.fullName }}</span></h4>
                        <h4>Nro. Afiliado: <span>{{ store.currentPDFInfo?.patient.affiliationId }}</span></h4>
                    </div>

                    <div>
                        <h4>Plan: <span>{{ store.currentPDFInfo?.patient.affiliationProvider.name }} ({{ store.currentPDFInfo?.patient.affiliationPlan }})</span></h4>
                        <h4>DNI: <span> {{ store.currentPDFInfo?.patient.userId }}</span></h4>
                    </div>
                </div>
            </div>

            <div>
                <img
                    :src="`/images/${store.currentPDFInfo?.patient.affiliationProvider.machineName || 'placeholder'}-logo.png`"
                    alt=""
                    class="header-image"
                >
            </div>
        </div>

        <div class="table-wrapper">

            <div class="diagnostico">
                Diagnostico: <strong>{{ store.currentPDFInfo?.diagnosis }}</strong>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Medicamento</th>
                        <th>Cantidad</th>
                        <th>Indicaciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="prescribedMedicine in store.currentPDFInfo?.prescribedMedicines"
                        :key="prescribedMedicine.id"
                    >
                        <td>{{ prescribedMedicine.medicine.tradeName }} ({{ prescribedMedicine.medicine.activeSubstance }})</td>
                        <td>{{ prescribedMedicine.qty }}</td>
                        <td>{{ prescribedMedicine.instructions }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div class="doctor-details">
            <h2>Profesional</h2>

            <div>

                <div>
                    <h4>Fecha: <span>{{ cleanCreatedAt(store.currentPDFInfo?.created_at as string).createdAtFormattedH }}</span></h4>
                    <h4>Firmado Digitalmente: <span>Fernando M. Cardoso</span></h4>
                    <h4>Especialidad: <span>Médico</span></h4>
                </div>

                <div>
                    <h4>M.P.: <span>33883/1</span></h4>
                    <h4>M.N.: <span>168592</span></h4>
                </div>

                <div class="flex-grow">
                    <img
                        src="/images/pdf-signature-fernando.png"
                        alt=""
                        class="signature"
                    >
                </div>
            </div>
        </div>

        <div class="certification-authority">
            <strong>Autoridad Certificante:</strong> Autoridad Certificante de la Administración Pública
        </div>

        <div class="validity">
            Receta válida hasta el día: {{ currentDate1MonthLater }} (un mes).
        </div>
    </div>

</template>

<style lang="scss" scoped>
.prescription-pdf-template {
    padding: 20px;
    position: fixed;
    z-index: 9999;
    background: white;
    width: 210mm;
    bottom: 53px;
    margin: 0;
    right: 0;
    height: 148mm;
    top: -99999em;

    // For debug comment and uncomment following lines.
    //top: 20px;
    //border: 1px solid red;
    //right: calc(50% - 105mm);

    .heading {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .header-image {
        width: 200px;
        height: auto;
    }

    .certification-authority {
        color: #9b9b9b;
        font-size: 12px;
    }

    .validity {
        border: #2a2a2a 4px solid;
        background: #e8e8e8;
        padding: 5px;
        margin-top: 10px;
    }

    .signature {
        width: 150px;
        height: auto;
        display: block;
    }

    table {
        border-collapse: collapse;
        border: 1px solid black;
        width: 100%;
        font-size: 12px;


        tr {
            text-align: left;

            th {
                padding: 5px;
            }

            td {
                border: 1px solid black;
                padding: 5px;
            }
        }
    }

    .table-wrapper {
        margin-bottom: 30px;
    }

}


.patient-details {
    margin-bottom: 20px;

    >div {
        display: flex;

        div {
            &:last-child {
                margin-left: 100px;
            }
        }
    }

    h2 {
        font-size: 16px;
        margin-top: 0;
    }

    h4 {
        font-size: 12px;
        margin-top: 0;
        margin-bottom: 10px;
    }

    span {
        font-size: 12px;
        font-weight: 300;
    }
}


.doctor-details {
    margin-bottom: 50px;

    >div {
        display: flex;

        div {
            &:nth-child(n+2) {
                margin-left: 100px;
            }
        }
    }

    h2 {
        font-size: 16px;
        margin-top: 0;
    }

    h4 {
        font-size: 12px;
        margin-top: 0;
        margin-bottom: 10px;
    }

    span {
        font-size: 12px;
        font-weight: 300;
    }
}

.diagnostico {
    margin-bottom: 10px;
    font-size: 14px;
}
</style>