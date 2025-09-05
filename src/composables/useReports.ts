import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

// Mock reports data
const mockReports = ref<any[]>([])

const reports = ref<any[]>([])
const loading = ref(false)

export const useReports = () => {
  const toast = useToast()

  const userReports = computed(() => mockReports.value)
  const pendingReports = computed(() => 
    mockReports.value.filter(report => report.status === 'pending')
  )

  const loadReports = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      reports.value = mockReports.value
    } catch (error: any) {
      toast.error('Error al cargar reportes')
    } finally {
      loading.value = false
    }
  }

  const createReport = async (reportData: {
    reported_user_id?: string
    product_id?: string
    property_id?: string
    service_id?: string
    reason: string
    description?: string
  }) => {
    try {
      const newReport = {
        id: Date.now().toString(),
        reporter_id: '1',
        ...reportData,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      mockReports.value.push(newReport)
      toast.success('Reporte enviado. Será revisado por nuestro equipo.')
      return true
    } catch (error: any) {
      toast.error('Error al enviar reporte')
      return false
    }
  }

  const updateReportStatus = async (
    reportId: string, 
    status: 'reviewed' | 'resolved' | 'dismissed'
  ) => {
    try {
      const report = mockReports.value.find(r => r.id === reportId)
      if (report) {
        report.status = status
        report.reviewed_by = '1'
        report.reviewed_at = new Date().toISOString()
        toast.success('Estado del reporte actualizado')
        return true
      }
      return false
    } catch (error: any) {
      toast.error('Error al actualizar reporte')
      return false
    }
  }

  return {
    reports: userReports,
    pendingReports,
    loading: computed(() => loading.value),
    loadReports,
    createReport,
    updateReportStatus
  }
}