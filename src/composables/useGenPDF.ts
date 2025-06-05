import type Prescription from '@/models/Prescription'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {useCentralStore} from '@/stores/centralStore'
import {nextTick} from 'vue'
import useSearchEngine from "@/composables/useSearchEngine"
import dayjs from "dayjs"
import 'jspdf-autotable'
import type {UserOptions} from 'jspdf-autotable'
import useSupabase from "@/composables/useSupabase";
import type AffiliationProvider from "@/models/AffiliationProvider";

const {supabase} = useSupabase()

interface jsPDFCustom extends jsPDF {
    autoTable: (options: UserOptions) => void
}


export default function useGenPDF() {
    const store = useCentralStore()
    const {doSearchPrescriptions, currentAppliedFilters} = useSearchEngine()

    const getFileName = (pres: Prescription): string => {
        const fullNameSafeString = pres.patient.fullName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
        const fullIdSafeString = pres.patient.userId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
        return `receta--${fullIdSafeString}--${fullNameSafeString}.pdf`
    }

    const getContent = (): Promise<HTMLCanvasElement> => {
        const template = document.querySelector('.prescription-pdf-template') as HTMLDivElement
        return html2canvas(template, {allowTaint: true, x: 0, y: 0})
    }

    const render = (fileName: string, content: HTMLCanvasElement) => {
        const doc = new jsPDF()
        doc.addImage(content, 'JPEG', 0, 0, 210, 148)
        doc.save(fileName)
    }

    const genPDF = async (pres: Prescription): Promise<void> => {
        store.currentPDFInfo = pres
        const pdfName = getFileName(store.currentPDFInfo)
        await nextTick()
        const content = await getContent()
        render(pdfName, content)
    }

    const genReportPDF = async (filterData: Record<any, any>): Promise<void> => {
        // let affiliationProvider = ''


        const res = await supabase
            .from('provider')
            .select(`*`)
            .eq('machineName', filterData.affiliationProvider)
            .single()

        const affiliationProvider = res.data as unknown as AffiliationProvider

        // Hard limit to 5k. A bigger PDF would be needed?
        // @fixme if results are bigger than 1000 abort and inform to the user.
        const tableResults = await doSearchPrescriptions({hitsPerPage: 2000}, true) as Prescription[]

        store.currentPDFReportInfo = {
            affiliationProvider: affiliationProvider,
            items: tableResults
        }

        const currentDate = dayjs.utc(new Date()).tz()
        const currentDateFormatted = currentDate.format('DD-MM-YYYY')
        const pdfName = `reporte--${affiliationProvider.machineName}--${currentDateFormatted}.pdf`


        await nextTick()

        const doc = new jsPDF() as jsPDFCustom


        const body: any[] = []

        tableResults.forEach((item: Prescription) => {
            const createdAt = dayjs.utc(item.created_at)
            const createdAtFormatted = createdAt.format('DD/MM/YYYY')
            body.push([
                {content: createdAtFormatted, styles: {fontStyle: 'bold'}},
                {content: item.diagnosis, styles: {fontStyle: 'bold'}},
                {content: `${item.patient.fullName} (DNI: ${item.patient.userId})`, styles: {fontStyle: 'bold'}},
                {content: item.patient.affiliationId, styles: {fontStyle: 'bold'}},
                {content: item.patient.affiliationPlan, styles: {fontStyle: 'bold'}}
            ])

            // Is just a header.
            body.push([{colSpan: 5, content: "Medicamentos", styles: {fillColor: [240, 240, 240]},}])


            item.prescribedMedicines.forEach((prescribedMedicine) => {
                body.push([{
                    colSpan: 5,
                    content: `${prescribedMedicine.medicine.tradeName} (${prescribedMedicine.medicine.activeSubstance}): Cantidad: ${prescribedMedicine.qty}`,
                    styles: {fillColor: [255, 255, 255]},
                }])
            })
        })

        const logo = new Image()
        logo.src = `/images/${affiliationProvider.machineName || 'placeholder'}-logo.png`

        doc.autoTable({
            head: [[
                'Fecha',
                'Diagnóstico',
                'Paciente',
                'Afiliado',
                'Plan',
            ]],
            body,
            margin: {top: 40},

            didDrawPage: (data) => {
                // Header
                doc.addImage(logo, 'JPEG', data.settings.margin.right, 15, 30, 15)

                doc.setFontSize(20)
                doc.setTextColor(40)
                doc.text(`Reporte ${affiliationProvider.name} - ${currentDateFormatted}`, data.settings.margin.left + 35, 22)

                doc.setFontSize(12)

                let subtitleText = 'Reporte de recetas elaboradas.'

                if (filterData.createdDate !== '') {
                    const from = dayjs(filterData.createdDate[0])
                    const fromFormatted = from.format('DD/MM/YYYY')
                    const to = dayjs(filterData.createdDate[1])
                    const toFormatted = to.format('DD/MM/YYYY')

                    subtitleText += ` (${fromFormatted} - ${toFormatted}).`
                }

                subtitleText += ` Total: ${tableResults.length}`

                doc.text(subtitleText, data.settings.margin.left + 35, 28)


            },
        })

        doc.save(pdfName)
    }

    return {
        genPDF,
        genReportPDF
    }
}