// Auth
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  username: string
  direction: string
  panelUrl: string
  token: string
}

export interface User {
  id: number
  username: string
  email?: string
  role: string
  isActive: boolean
  createdAt?: string
}

// Dashboard
export interface LandSummary {
  totalArea?: number | null
  irrigatedArea?: number | null
  cottonArea?: number | null
  wheatArea?: number | null
  orchardArea?: number | null
  grapeArea?: number | null
  greenhouseArea?: number | null
  lalmiArea?: number | null
  poplarArea?: number | null
  otherTreeArea?: number | null
  pastureArea?: number | null
  hayfieldArea?: number | null
  meliorationArea?: number | null
  pondArea?: number | null
  reservoirArea?: number | null
  canalArea?: number | null
  houseArea?: number | null
  yardArea?: number | null
  buildingArea?: number | null
  otherArea?: number | null
  totalBalance?: number | null
  cropStats?: CropStatItem[]
  growthData?: GrowthDataItem[]
}

export interface LandDistributionItem {
  name: string
  value: number
  color: string
}

export interface CropStatItem {
  name: string
  maydon: number
  hosildorlik: number
}

export interface GrowthDataItem {
  month: string
  fermerlar: number
  maydon: number
}

// Farmer
export interface Farmer {
  id: number
  orderNumber?: number | null
  name: string
  farmType?: string
  specialization?: string
  rightType?: string
  stir: string
  cadastralNumber?: string
  totalArea?: number | null
  irrigatedArea?: number | null
  cottonArea?: number | null
  wheatArea?: number | null
  greenhouseArea?: number | null
  lalmiArea?: number | null
  orchardArea?: number | null
  grapeArea?: number | null
  poplarArea?: number | null
  otherTreeArea?: number | null
  pastureArea?: number | null
  hayfieldArea?: number | null
  meliorationArea?: number | null
  pondArea?: number | null
  reservoirArea?: number | null
  canalArea?: number | null
  houseArea?: number | null
  yardArea?: number | null
  buildingArea?: number | null
  otherArea?: number | null
  totalBalance?: number | null
  season?: number
  deleted?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface FarmerAnalytics {
  farmerId: number
  totalLand: number
  irrigatedLand: number
  cropTypes: string[]
  productivity: number
}

// Agro Technic
export interface AgroTechnic {
  id: number
  ownerName?: string
  ownershipType?: string
  inn?: string
  district?: string
  workType?: string | null
  model?: string
  technicType?: string
  productionYear?: number | null
  engineNumber?: string
  enginePower?: number | null
  chassisNumber?: string
  color?: string
  regionCode?: string
  series?: string
  number?: string
}

// Cadastre Land Record (API response shape)
export interface CadastreRecord {
  id: number
  regionName?: string
  districtName?: string
  neighborhoodName?: string
  contourNumber?: string
  area?: number
  landType?: string
  farmName?: string
  landNumber?: string
  cadastreNumber?: string
  cadastralRegistered?: string | null
  notRegisteredReason?: string | null
  problem?: string | null
  problemDescription?: string | null
}

/** @deprecated use CadastreRecord */
export interface CadastreLandRecord {
  id: number
  cadastreNumber: string
  area: number
  landType: string
  farmerId?: number
  farmerName?: string
  region?: string
  status?: string
  registeredDate?: string
}

// Greenhouse Record
export interface GreenhouseRecord {
  id: number
  ownerName?: string | null
  contourNumber?: string | null
  cropName?: string | null
  greenhouseArea?: number | null
  totalArea?: number | null
  jshshir?: string | null
  passportSeries?: string | null
  phoneNumber?: string | null
  mfy?: string | null
  locationUrl?: string | null
  seedlingCount?: number | null
  requiredSeedlingCount?: number | null
}

// Farm Representative
export interface FarmRepresentative {
  id: number
  farmName?: string | null
  farmerFullName?: string | null
  farmerPhone?: string | null
  landManagerFullName?: string | null
  landManagerPhone?: string | null
  inn?: string | null
  activityType?: string | null
  livestockCount?: number | null
}

// Land Contour
export interface LandContour {
  id: number
  contourNumber?: string | null
  totalArea?: number | null
  irrigatedAgricultureArea?: number | null
  irrigatedTomorqaArea?: number | null
  orchardArea?: number | null
  vineyardArea?: number | null
  mulberryArea?: number | null
  nurseryArea?: number | null
  meliorationArea?: number | null
  grayLandAgricultureArea?: number | null
  grayLandPastureArea?: number | null
  commonYardArea?: number | null
  agricultureTotalArea?: number | null
  agricultureArableArea?: number | null
  agricultureIrrigatedArea?: number | null
  tomorqaTotalArea?: number | null
  tomorqaInsideSettlementArea?: number | null
  treePlantationArea?: number | null
  pastureArea?: number | null
  lakeFishArea?: number | null
  publicBuildingsArea?: number | null
  streetsArea?: number | null
  cemeteryArea?: number | null
  constructionArea?: number | null
  forestArea?: number | null
  canalsArea?: number | null
  roadsArea?: number | null
  otherLandsArea?: number | null
  buildingUnderArea?: number | null
  agriculturalServiceArea?: number | null
  cottonReceptionArea?: number | null
  abandonedFarmBuildingArea?: number | null
  auxiliaryFarmArea?: number | null
}

// Pump Station
export interface PumpStation {
  id: number
  stationName: string
  installedAggregateCount?: number | null
  workingAggregateCount?: number | null
  waterSource?: string | null
}

export interface PumpTechnical {
  id: number
  stationId: number
  stationName?: string
  pumpType: string
  power?: number
  status?: string
}

export interface FarmerPumpAggregate {
  farmerId: number
  farmerName: string
  totalPumps: number
  activePumps: number
  totalCapacity: number
}

// Specialization
export interface Specialization {
  id: number
  name: string
  code?: string
}

export interface SpecializationSummary {
  id: string
  name: string
  farmersCount: number
  totalLandHa: number
  percentage?: number
  color?: string
}

// Pagination
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// API Response
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Table
export interface Column<T> {
  key: keyof T | string
  title: string
  render?: (value: unknown, row: T, index?: number) => React.ReactNode
  width?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  onRowClick?: (row: T) => void
}

// Modal
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
