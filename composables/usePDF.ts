import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Prescription } from '~/types'
import dayjs from 'dayjs'

export const usePDF = () => {
  const generatePrescriptionPDF = (prescription: Prescription) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('Receta Médica', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`Fecha: ${dayjs(prescription.createdAt).format('DD/MM/YYYY HH:mm')}`, 20, 35)

    // Patient Information
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Información del Paciente', 20, 50)

    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    doc.text(`Nombre: ${prescription.patient?.fullName}`, 20, 60)
    doc.text(`DNI: ${prescription.patient?.userId}`, 20, 67)
    doc.text(`Obra Social: ${prescription.patient?.provider?.name}`, 20, 74)
    doc.text(`Plan: ${prescription.patient?.plan?.name}`, 20, 81)
    doc.text(`Nº Afiliación: ${prescription.patient?.affiliationId}`, 20, 88)

    // Diagnosis
    doc.setFont(undefined, 'bold')
    doc.text('Diagnóstico:', 20, 100)
    doc.setFont(undefined, 'normal')
    doc.text(prescription.diagnosisInfo?.name || '', 20, 107)

    // Medicines Table
    doc.setFont(undefined, 'bold')
    doc.text('Medicamentos Prescritos', 20, 120)

    const tableData = prescription.medicines?.map((pm) => [
      pm.medicine?.tradeName || '',
      pm.medicine?.activeSubstance || '',
      pm.qty.toString(),
      pm.instructions,
    ]) || []

    autoTable(doc, {
      startY: 125,
      head: [['Nombre Comercial', 'Droga', 'Cant.', 'Instrucciones']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    })

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 150
    doc.setFontSize(10)
    doc.text(`Médico: ${prescription.authorUser?.name} ${prescription.authorUser?.surname}`, 20, finalY + 15)
    doc.text(`Validez: ${dayjs(prescription.createdAt).add(30, 'days').format('DD/MM/YYYY')}`, 20, finalY + 22)

    // Download
    doc.save(`receta-${prescription.patient?.fullName}-${dayjs(prescription.createdAt).format('YYYY-MM-DD')}.pdf`)
  }

  const generateReportPDF = (prescriptions: Prescription[], filters: any) => {
    const doc = new jsPDF('l') // Landscape

    // Header
    doc.setFontSize(18)
    doc.text('Reporte de Recetas', 148, 20, { align: 'center' })

    doc.setFontSize(10)
    let yPos = 30
    if (filters.dateFrom || filters.dateTo) {
      const from = filters.dateFrom ? dayjs(filters.dateFrom).format('DD/MM/YYYY') : 'N/A'
      const to = filters.dateTo ? dayjs(filters.dateTo).format('DD/MM/YYYY') : 'N/A'
      doc.text(`Período: ${from} - ${to}`, 20, yPos)
      yPos += 7
    }
    if (filters.affiliationProvider) {
      doc.text(`Obra Social: ${filters.affiliationProvider}`, 20, yPos)
      yPos += 7
    }

    doc.text(`Total de recetas: ${prescriptions.length}`, 20, yPos)

    // Table
    const tableData = prescriptions.map((p) => [
      dayjs(p.createdAt).format('DD/MM/YYYY'),
      p.patient?.fullName || '',
      p.patient?.userId || '',
      p.diagnosisInfo?.name || '',
      p.patient?.provider?.name || '',
      `${p.authorUser?.name} ${p.authorUser?.surname}`,
    ])

    autoTable(doc, {
      startY: yPos + 10,
      head: [['Fecha', 'Paciente', 'DNI', 'Diagnóstico', 'Obra Social', 'Médico']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
    })

    // Download
    doc.save(`reporte-recetas-${dayjs().format('YYYY-MM-DD')}.pdf`)
  }

  return {
    generatePrescriptionPDF,
    generateReportPDF,
  }
}
