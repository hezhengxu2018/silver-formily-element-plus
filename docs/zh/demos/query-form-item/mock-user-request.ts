export interface UserRecord {
  id: string
  name: string
  department: string
}

export const userSource: UserRecord[] = Array.from({ length: 80 }, (_, index) => ({
  id: `${index + 1}`,
  name: `User-${index + 1}`,
  department: index % 2 === 0 ? 'R&D' : 'Product',
}))

export function createUserRequest(delay = 200) {
  return async function request(params: Record<string, any>) {
    await new Promise(resolve => setTimeout(resolve, delay))

    const keyword = `${params.keyword ?? ''}`.trim().toLowerCase()
    const department = `${params.department ?? ''}`.trim()

    const filtered = userSource.filter((item) => {
      const keywordMatched = keyword ? item.name.toLowerCase().includes(keyword) : true
      const departmentMatched = department ? item.department === department : true
      return keywordMatched && departmentMatched
    })

    const current = Number(params.current) || 1
    const pageSize = Number(params.pageSize) || 10
    const start = (current - 1) * pageSize
    const end = current * pageSize

    return {
      data: filtered.slice(start, end),
      success: true,
      total: filtered.length,
    }
  }
}
