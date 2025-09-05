<template>
  <!-- Modal de edición de usuario -->
  <UserForm
    v-if="showUserForm"
    :user="currentUser"
    :is-editing="!!currentUser"
    @saved="handleUserSaved"
    @close="showUserForm = false"
  />

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
      <p class="text-gray-600">Gestiona usuarios, productos y contenido de la plataforma</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
            <Package class="w-6 h-6 text-secondary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Publicaciones</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ (stats.totalProducts || 0) + (stats.totalProperties || 0) + (stats.totalServices || 0) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Publicaciones Activas</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ (stats.activeProducts || 0) + (stats.activeProperties || 0) + (stats.activeServices || 0) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Reportes Pendientes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingReports }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Tabs -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="border-b border-gray-200 overflow-x-auto">
        <nav class="flex w-max min-w-full">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              'flex-shrink-0 flex items-center',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4 mr-1.5" />
            <span class="text-xs sm:text-sm">{{ tab.name }}</span>
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Users Tab -->
        <div v-if="activeTab === 'users'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
            <div class="flex gap-2">
              <input
                v-model="userSearch"
                type="text"
                placeholder="Buscar usuarios..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button 
                @click="openNewUserForm"
                class="btn-primary flex items-center gap-1.5"
              >
                <UserPlus class="w-4 h-4" />
                <span class="hidden sm:inline">Nuevo Usuario</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insignia
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <User class="w-4 h-4 text-white" />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ user.full_name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="user.badge"
                      :class="getBadgeClass(user.badge)"
                      class="px-2 py-1 rounded-full text-xs font-medium text-white"
                    >
                      {{ getBadgeText(user.badge) }}
                    </span>
                    <span v-else class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Sin rol
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.product_count || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="editUser(user)"
                        class="text-primary-600 hover:text-primary-900"
                      >
                        Editar
                      </button>
                      <button
                        @click="deleteUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Properties Tab -->
        <div v-else-if="activeTab === 'properties'" class="bg-white rounded-lg shadow p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 class="text-xl font-semibold text-gray-800">Gestión de Propiedades</h2>
            <div class="relative w-full sm:w-auto">
              <input
                v-model="propertySearch"
                type="text"
                placeholder="Buscar propiedades..."
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
              <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          
          <div class="mb-4 flex flex-wrap gap-2 sm:gap-4">
            <select
              v-model="propertyStatusFilter"
              class="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="sold">Vendidas</option>
              <option value="rented">Arrendadas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          <div class="overflow-x-auto -mx-2 sm:mx-0">
            <div class="min-w-full align-middle">
              <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 hidden sm:table-header-group">
                    <tr>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ubicación</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th class="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="property in filteredProperties" :key="property.id" class="flex flex-col sm:table-row hover:bg-gray-50">
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img v-if="property.images && property.images.length > 0" 
                                :src="property.images[0]" 
                                :alt="property.title"
                                class="h-10 w-10 rounded-full object-cover">
                            <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Home class="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ property.title }}</div>
                            <div class="text-sm text-gray-500 sm:hidden">
                              {{ property.property_type }} • {{ property.location }}
                            </div>
                            <div class="sm:hidden text-sm text-gray-500 mt-1">
                              {{ formatDate(property.created_at) }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span class="sm:hidden font-semibold mr-2">Precio:</span>
                        ${{ formatPrice(property.price) }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {{ property.property_type }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {{ property.location }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span :class="getStatusClass(property.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ getStatusText(property.status) }}
                        </span>
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button @click="editProperty(property)" class="text-indigo-600 hover:text-indigo-900" title="Editar">
                          <Edit class="w-5 h-5" />
                        </button>
                        <button @click="deleteProperty(property.id)" class="text-red-600 hover:text-red-900" title="Eliminar">
                          <Trash2 class="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div v-if="filteredProperties.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron propiedades que coincidan con la búsqueda.
          </div>
        </div>

        <!-- Services Tab -->
        <div v-else-if="activeTab === 'services'" class="bg-white rounded-lg shadow p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 class="text-xl font-semibold text-gray-800">Gestión de Servicios</h2>
            <div class="relative w-full sm:w-auto">
              <input
                v-model="serviceSearch"
                type="text"
                placeholder="Buscar servicios..."
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
              <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          
          <div class="mb-4 flex flex-wrap gap-2 sm:gap-4">
            <select
              v-model="serviceStatusFilter"
              class="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div class="overflow-x-auto -mx-2 sm:mx-0">
            <div class="min-w-full align-middle">
              <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 hidden sm:table-header-group">
                    <tr>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ubicación</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th class="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="service in filteredServices" :key="service.id" class="flex flex-col sm:table-row hover:bg-gray-50">
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img v-if="service.images && service.images.length > 0" 
                                 :src="service.images[0]" 
                                 :alt="service.title"
                                 class="h-10 w-10 rounded-full object-cover">
                            <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Settings class="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ service.title }}</div>
                            <div class="text-sm text-gray-500 sm:hidden">
                              {{ service.category }} • {{ service.location }}
                            </div>
                            <div class="sm:hidden text-sm text-gray-500 mt-1">
                              {{ formatDate(service.created_at) }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span class="sm:hidden font-semibold mr-2">Precio:</span>
                        ${{ formatPrice(service.price) }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {{ service.category }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {{ service.location }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span :class="getStatusClass(service.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ getStatusText(service.status) }}
                        </span>
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button @click="editService(service)" class="text-indigo-600 hover:text-indigo-900" title="Editar">
                          <Edit class="w-5 h-5" />
                        </button>
                        <button @click="deleteService(service.id)" class="text-red-600 hover:text-red-900" title="Eliminar">
                          <Trash2 class="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div v-if="filteredServices.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron servicios que coincidan con la búsqueda.
          </div>
        </div>

        <!-- Products Tab -->
        <div v-else-if="activeTab === 'products'" class="bg-white rounded-lg shadow p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 class="text-xl font-semibold text-gray-800">Gestión de Productos</h2>
            <div class="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <div class="relative w-full sm:w-64">
                <input
                  v-model="productSearch"
                  type="text"
                  placeholder="Buscar productos..."
                  class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <select
                v-model="productStatusFilter"
                class="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="sold">Vendidos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto -mx-2 sm:mx-0">
            <div class="min-w-full align-middle">
              <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 hidden sm:table-header-group">
                    <tr>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th class="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="product in filteredProducts" :key="product.id" class="flex flex-col sm:table-row hover:bg-gray-50">
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img v-if="product.images?.[0]" class="h-10 w-10 rounded-full object-cover" :src="product.images[0]" :alt="product.title" />
                            <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <ImageOff class="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                            <div class="text-sm text-gray-500 sm:hidden">
                              {{ product.category }}
                            </div>
                            <div class="sm:hidden text-sm text-gray-500 mt-1">
                              {{ formatDate(product.created_at) }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {{ product.category }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                        <span class="sm:hidden font-semibold mr-2">Precio:</span>
                        ${{ formatPrice(product.price) }}
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(product.status)}`">
                          {{ getStatusText(product.status) }}
                        </span>
                      </td>
                      <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900" title="Editar">
                          <Edit class="w-5 h-5" />
                        </button>
                        <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900" title="Eliminar">
                          <Trash2 class="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div v-if="filteredProducts.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron productos que coincidan con la búsqueda.
          </div>
        </div>

        <!-- Reports Tab -->
        <div v-else-if="activeTab === 'reports'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Reportes y Moderación</h2>
          </div>

          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div class="flex-1">
                <label for="report-type-filter" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                <select
                  id="report-type-filter"
                  v-model="reportTypeFilter"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Contenido inapropiado</option>
                  <option value="scam">Estafa</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div class="flex-1">
                <label for="report-status-filter" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  id="report-status-filter"
                  v-model="reportStatusFilter"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="pending">Pendientes</option>
                  <option value="resolved">Resueltos</option>
                  <option value="all">Todos</option>
                </select>
              </div>
            </div>

            <div v-if="filteredReports.length > 0" class="space-y-4">
              <div 
                v-for="report in filteredReports" 
                :key="report.id"
                class="border rounded-lg p-4"
                :class="{
                  'border-red-200 bg-red-50': report.status === 'pending',
                  'border-green-200 bg-green-50': report.status === 'resolved'
                }"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-medium text-gray-900">
                        {{ getReportTypeText(report.type) }}
                      </h3>
                      <span 
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-red-100 text-red-800': report.status === 'pending',
                          'bg-green-100 text-green-800': report.status === 'resolved'
                        }"
                      >
                        {{ report.status === 'resolved' ? 'Resuelto' : 'Pendiente' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                      Reportado por: {{ report.reporter?.email || 'Usuario eliminado' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      Fecha: {{ formatDate(report.created_at) }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      v-if="report.status !== 'resolved'"
                      @click="resolveReport(report.id)"
                      class="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Marcar como resuelto
                    </button>
                    <button
                      @click="deleteReport(report.id)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <div class="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p class="text-sm font-medium text-gray-900">Mensaje:</p>
                  <p class="text-sm text-gray-700 mt-1">{{ report.message || 'Sin mensaje adicional' }}</p>
                </div>

                <div v-if="report.product" class="mt-3 p-3 bg-gray-50 rounded">
                  <p class="text-sm font-medium text-gray-900">Producto reportado:</p>
                  <div class="flex items-center gap-3 mt-2">
                    <img 
                      :src="report.product.images?.[0]" 
                      :alt="report.product.title"
                      class="w-12 h-12 object-cover rounded"
                      v-if="report.product.images?.[0]"
                    />
                    <div>
                      <p class="text-sm font-medium">{{ report.product.title }}</p>
                      <p class="text-sm text-gray-600">${{ formatPrice(report.product.price) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
              <AlertTriangle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay reportes</h3>
              <p class="text-gray-600">No se encontraron reportes con los filtros seleccionados</p>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-else-if="activeTab === 'settings'" class="bg-white shadow rounded-lg p-8 text-center">
          <div class="text-gray-400">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Configuración no disponible</h3>
            <p class="mt-1 text-sm text-gray-500">La sección de configuración está actualmente en desarrollo.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase, supabaseAdmin } from '../lib/supabase'
import UserForm from '../components/admin/UserForm.vue'
// Importaciones dinámicas de íconos
import { defineAsyncComponent } from 'vue'

// Importaciones sincrónicas para íconos
import { Search } from 'lucide-vue-next'

// Componentes asíncronos para íconos
const Users = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.Users))
const User = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.User))
const Package = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.Package))
const Home = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.Home))
const Edit = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.Edit))
const Trash2 = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.Trash2))
const ImageOff = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.ImageOff))
const AlertTriangle = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.AlertTriangle))
const CheckCircle2 = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.CheckCircle2))
const Settings = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.Settings))
const UserPlus = defineAsyncComponent(() => import('lucide-vue-next').then(m => m.UserPlus))
// Tipos de datos
interface UserType {
  id: string
  email: string
  full_name: string
  phone?: string
  created_at: string
  product_count?: number
  badge?: string
}

interface Product {
  id: string
  title: string
  price: number
  category: string
  description: string
  status: string
  images?: string[]
  created_at: string
  type: 'product'
}

interface Property {
  id: string
  title: string
  price: number
  property_type: string  // casa, apartamento, etc.
  status: string
  location: string
  images?: string[]
  created_at: string
  type: 'property'
}

interface Service {
  id: string
  title: string
  price: number
  category: string
  status: string
  description: string
  location: string
  images?: string[]
  created_at: string
  type: 'service'
}

interface Report {
  id: string
  type: string
  status: 'pending' | 'resolved'
  message: string
  created_at: string
  reporter?: {
    id: string
    email: string
    full_name: string
  }
  product?: Product
  resolved_at?: string
}

// Estado reactivo
const activeTab = ref('users')
const userSearch = ref('')
const productSearch = ref('')
const showUserForm = ref(false)
const currentUser = ref<UserType | null>(null)
const propertySearch = ref('')
const serviceSearch = ref('')
const productStatusFilter = ref('')
const propertyStatusFilter = ref('')
const serviceStatusFilter = ref('')
const reportTypeFilter = ref('')
const reportStatusFilter = ref('')
// Configuración del sitio (comentado por ahora)
// const siteTitle = ref('WebProMercado')
// const siteDescription = ref('Tu mercado en línea de confianza')
// const maintenanceMode = ref(false)

// Datos
const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  activeProducts: 0,
  totalProperties: 0,
  activeProperties: 0,
  totalServices: 0,
  activeServices: 0,
  totalReports: 0,
  pendingReports: 0
})

const users = ref<UserType[]>([])
const products = ref<Product[]>([])
const properties = ref<Property[]>([])
const services = ref<Service[]>([])
const reports = ref<Report[]>([])

const tabs = [
  { id: 'users', name: 'Usuarios', icon: 'Users' },
  { id: 'products', name: 'Productos', icon: 'Package' },
  { id: 'properties', name: 'Propiedades', icon: 'Home' },
  { id: 'services', name: 'Servicios', icon: 'Wrench' },
  { id: 'reports', name: 'Reportes', icon: 'AlertTriangle' },
  { id: 'settings', name: 'Configuración', icon: 'Settings' }
]


// Propiedades computadas
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const searchTerm = userSearch.value.toLowerCase()
    return (
      user.full_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone?.toLowerCase().includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm)
    )
  })
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(productSearch.value.toLowerCase()) ||
                         product.description.toLowerCase().includes(productSearch.value.toLowerCase()) ||
                         product.id.toLowerCase().includes(productSearch.value.toLowerCase())
    
    const matchesStatus = !productStatusFilter.value || product.status === productStatusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const filteredProperties = computed(() => {
  let filtered = properties.value

  if (propertyStatusFilter.value) {
    filtered = filtered.filter(p => p.status === propertyStatusFilter.value)
  }

  if (propertySearch.value) {
    const query = propertySearch.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      (p.location?.toLowerCase().includes(query) || '') ||
      (p.property_type?.toLowerCase().includes(query) || '')
    )
  }

  return filtered
})

const filteredServices = computed(() => {
  let filtered = services.value

  if (serviceStatusFilter.value) {
    filtered = filtered.filter(s => s.status === serviceStatusFilter.value)
  }

  if (serviceSearch.value) {
    const query = serviceSearch.value.toLowerCase()
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(query) ||
      (s.category?.toLowerCase().includes(query) || '') ||
      (s.description?.toLowerCase().includes(query) || '')
    )
  }

  return filtered
})

const filteredReports = computed(() => {
  let filtered = reports.value

  if (reportStatusFilter.value && reportStatusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === reportStatusFilter.value)
  }

  if (reportTypeFilter.value && reportTypeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.type === reportTypeFilter.value)
  }

  return filtered
})

// Métodos
const loadStats = async () => {
  try {
    // Cargar estadísticas de usuarios
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Cargar estadísticas de productos
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, status')
    
    if (productsError) throw productsError

    // Cargar estadísticas de propiedades
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .select('id, status')
    
    if (propertiesError) throw propertiesError

    // Cargar estadísticas de servicios
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, status')
    
    if (servicesError) throw servicesError

    // Cargar reportes
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('id, status')
    
    if (reportsError) throw reportsError

    // Inicializar contadores
    const totalProducts = productsData?.length || 0
    const activeProducts = productsData?.filter(p => p.status === 'active').length || 0
    const totalProperties = propertiesData?.length || 0
    const activeProperties = propertiesData?.filter(p => p.status === 'active').length || 0
    const totalServices = servicesData?.length || 0
    const activeServices = servicesData?.filter(s => s.status === 'active').length || 0
    const totalReports = reportsData?.length || 0
    const pendingReports = reportsData?.filter(r => r.status === 'pending').length || 0

    stats.value = {
      totalUsers: userCount || 0,
      totalProducts,
      activeProducts,
      totalProperties,
      activeProperties,
      totalServices,
      activeServices,
      totalReports,
      pendingReports
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

const loadUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  }
}

const loadProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    products.value = (data || []).map(p => ({ ...p, type: 'product' }))
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

const loadProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    properties.value = (data || []).map(p => ({ ...p, type: 'property' }))
  } catch (error) {
    console.error('Error cargando propiedades:', error)
  }
}

const loadServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    services.value = (data || []).map(s => ({ ...s, type: 'service' }))
  } catch (error) {
    console.error('Error cargando servicios:', error)
  }
}

const loadReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:reporter_id (id, email, full_name),
        product:product_id (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    reports.value = data || []
    
    // Actualizar estadísticas después de cargar reportes
    stats.value.pendingReports = data?.filter((r: any) => r.status === 'pending').length || 0
  } catch (error) {
    console.error('Error cargando reportes:', error)
  }
}

const resolveReport = async (reportId: string) => {
  if (!confirm('¿Marcar este reporte como resuelto?')) return

  try {
    const { error } = await supabase
      .from('reports')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', reportId)
    
    if (error) throw error
    
    // Actualizar estado local
    const index = reports.value.findIndex(r => r.id === reportId)
    if (index !== -1) {
      reports.value[index].status = 'resolved'
      stats.value.pendingReports = Math.max(0, stats.value.pendingReports - 1)
    }
    
    alert('Reporte marcado como resuelto')
  } catch (error) {
    console.error('Error resolviendo reporte:', error)
    alert('Error al marcar el reporte como resuelto')
  }
}

const deleteReport = async (reportId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) return

  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)
    
    if (error) throw error
    
    // Actualizar estado local
    const wasPending = reports.value.find(r => r.id === reportId)?.status === 'pending'
    reports.value = reports.value.filter(r => r.id !== reportId)
    
    if (wasPending) {
      stats.value.pendingReports = Math.max(0, stats.value.pendingReports - 1)
    }
    
    alert('Reporte eliminado correctamente')
  } catch (error) {
    console.error('Error eliminando reporte:', error)
    alert('Error al eliminar el reporte')
  }
}

// Funciones de utilidad
const getReportTypeText = (type: string) => {
  const types: { [key: string]: string } = {
    spam: 'Spam',
    inappropriate: 'Contenido inapropiado',
    scam: 'Posible estafa',
    other: 'Otro problema'
  }
  return types[type] || type
}

const getBadgeClass = (badge?: string) => {
  switch (badge) {
    case 'destacado': return 'bg-yellow-500'
    case 'colaborador': return 'bg-blue-500'
    case 'vip': return 'bg-purple-500'
    case 'moderador': return 'bg-green-500'
    case 'admin': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getBadgeText = (badge?: string) => {
  switch (badge) {
    case 'destacado': return 'Destacado'
    case 'colaborador': return 'Colaborador'
    case 'vip': return 'VIP'
    case 'moderador': return 'Moderador'
    case 'admin': return 'Admin'
    default: return 'Sin rol'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs'
    case 'sold': return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs'
    case 'inactive': return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
    default: return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Activo'
    case 'sold': return 'Vendido'
    case 'rented': return 'Arrendado'
    case 'inactive': return 'Inactivo'
    default: return status
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editUser = (user: UserType) => {
  currentUser.value = { ...user }
  showUserForm.value = true
}

const handleUserSaved = async (userData: UserType) => {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        ...userData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
    
    if (error) throw error
    
    // Refresh the users list and stats
    await loadUsers()
    await loadStats()
    
    // Close the form
    showUserForm.value = false
    currentUser.value = null
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    alert('Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.')
  }
}

const openNewUserForm = () => {
  currentUser.value = null
  showUserForm.value = true
}

const deleteUser = async (userId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) return
  
  try {
    // 1. Primero eliminamos el perfil usando el cliente de administración
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileError) throw profileError
    
    // 2. Luego eliminamos el usuario de autenticación
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error eliminando usuario de autenticación:', authError)
      throw new Error('No se pudo eliminar el usuario de autenticación')
    }
    
    // 3. Actualizar la lista de usuarios localmente
    users.value = users.value.filter((u: UserType) => u.id !== userId)
    stats.value.totalUsers--
    
    // Mostrar notificación de éxito
    alert('Usuario eliminado correctamente')
    
    // Recargar la lista de usuarios para asegurar consistencia
    await loadUsers()
    
  } catch (error: any) {
    console.error('Error eliminando usuario:', error)
    
    // Mensaje de error más descriptivo
    let errorMessage = 'Error al eliminar el usuario. '
    if (error.message.includes('permission denied')) {
      errorMessage += 'No tienes permisos para realizar esta acción.'
    } else if (error.message.includes('User not found')) {
      errorMessage += 'El usuario no fue encontrado.'
    } else {
      errorMessage += 'Por favor, verifica la consola para más detalles.'
    }
    
    alert(errorMessage)
  }
}

const editProduct = (product: Product) => {
  console.log('Editar producto:', product)
  // Implementar lógica de edición
}

const deleteProduct = async (productId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return
  
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (error) throw error
    
    // Actualizar lista de productos
    const deletedProduct = products.value.find(p => p.id === productId)
    if (deletedProduct?.status === 'active') {
      stats.value.activeProducts--
    }
    
    products.value = products.value.filter(p => p.id !== productId)
    stats.value.totalProducts--
    
    alert('Producto eliminado correctamente')
  } catch (error) {
    console.error('Error eliminando producto:', error)
    alert('Error al eliminar el producto')
  }
}

const editProperty = (property: Property) => {
  console.log('Editar propiedad:', property)
  // Implementar lógica de edición
}

const deleteProperty = async (propertyId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return
  
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
    
    if (error) throw error
    
    // Actualizar lista de propiedades
    const deletedProperty = properties.value.find(p => p.id === propertyId)
    if (deletedProperty?.status === 'active') {
      stats.value.activeProperties--
    }
    
    properties.value = properties.value.filter(p => p.id !== propertyId)
    stats.value.totalProperties--
    
    alert('Propiedad eliminada correctamente')
  } catch (error) {
    console.error('Error eliminando propiedad:', error)
    alert('Error al eliminar la propiedad')
  }
}

const editService = (service: Service) => {
  console.log('Editar servicio:', service)
  // Implementar lógica de edición
}

const deleteService = async (serviceId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return
  
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
    
    if (error) throw error
    
    // Actualizar lista de servicios
    const deletedService = services.value.find(s => s.id === serviceId)
    if (deletedService?.status === 'active') {
      stats.value.activeServices--
    }
    
    services.value = services.value.filter(s => s.id !== serviceId)
    stats.value.totalServices--
    
    alert('Servicio eliminado correctamente')
  } catch (error) {
    console.error('Error eliminando servicio:', error)
    alert('Error al eliminar el servicio')
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadUsers(),
    loadProducts(),
    loadProperties(),
    loadServices(),
    loadReports()
  ])
})
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
