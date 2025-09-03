<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out lg:translate-x-0 group"
      :class="{ 
        '-translate-x-full': !sidebarOpen, 
        'translate-x-0': sidebarOpen,
        'w-16 hover:w-64': !sidebarExpanded,
        'w-64': sidebarExpanded
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Logo y título -->
      <div class="flex items-center h-16 px-4 bg-indigo-600 transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <div 
            class="ml-3 transition-all duration-300 overflow-hidden"
            :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
          >
            <h1 class="text-white text-lg font-semibold whitespace-nowrap">Farmacia</h1>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="mt-5 px-2">
        <div class="space-y-1">
          <!-- Dashboard -->
          <router-link
            to="/dashboard"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/dashboard') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'Dashboard' : ''"
          >
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/dashboard') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"></path>
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Home
            </span>
          </router-link>

          <!--Actas -->
          <router-link
            to="/actas"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/actas') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'Actas' : ''"
          >
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/actas') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Actas
            </span>
          </router-link>

          <!-- OrdenPedido -->
          <router-link
            to="/orden-pedido"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/orden-pedido') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'Orden de Pedido' : ''"
          >
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/orden-pedido') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Orden de Pedido
            </span>
          </router-link>

          <!-- Factura con subitems -->
          <div class="relative">
            <button
              @click="toggleFacturaSubmenu"
              cursor="pointer"
              class="group flex items-center w-full px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
              :class="isActiveRoute('/factura') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
              :title="!isExpanded ? 'Factura' : ''"
            >
              <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/factura') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span 
                class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap flex-1 text-left"
                :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
              >
                Factura
              </span>
              <svg 
                v-if="isExpanded"
                class="ml-2 h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': facturaSubmenuOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Submenu de Factura -->
            <div 
              v-if="facturaSubmenuOpen && isExpanded"
              class="ml-6 mt-1 space-y-1 transition-all duration-300"
            >
              <router-link
                to="/factura/automatico"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300"
                :class="isActiveRoute('/factura/automatico') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="h-4 w-4 flex-shrink-0 mr-3" :class="isActiveRoute('/factura/automatico') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                Registro Automático
              </router-link>

              <router-link
                to="/factura/manual"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300"
                :class="isActiveRoute('/factura/manual') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="h-4 w-4 flex-shrink-0 mr-3" :class="isActiveRoute('/factura/manual') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Registro Manual
              </router-link>
            </div>
          </div>

          <!-- Proveedores -->
          <router-link
            to="/proveedores"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/proveedores') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'Proveedores' : ''"
          >
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/proveedores') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Proveedores
            </span>
          </router-link>

            <router-link
            to="/productos"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/productos') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'productos' : ''"
            >
            <!-- Icono de caja para productos -->
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/productos') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 16V8a2 2 0 00-1.106-1.789l-7-4a2 2 0 00-1.788 0l-7 4A2 2 0 003 8v8a2 2 0 001.106 1.789l7 4a2 2 0 001.788 0l7-4A2 2 0 0021 16z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.27 6.96l8.73 5.04 8.73-5.04" />
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Productos
            </span>
            </router-link>

          <!-- comparacion -->
          <router-link
            to="/comparacion-actas"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/comparacion') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'comparacion' : ''"
          >
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/comparacion') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Comparacion
            </span>
          </router-link>

          
          <!-- productos -->

          <!-- Reportes -->
          <router-link
            to="/reportes"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
            :class="isActiveRoute('/reportes') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            :title="!isExpanded ? 'Reportes' : ''"
          >
            <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/reportes') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span 
              class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
              :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
            >
              Reportes
            </span>
          </router-link>
        </div>

        <!-- Sección de configuración -->
        <div class="mt-8">
          <h3 
            class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-all duration-300 overflow-hidden"
            :class="{ 'opacity-0 h-0': !isExpanded, 'opacity-100 h-auto': isExpanded }"
          >
            Configuración
          </h3>
          <div class="mt-2 space-y-1">
            <router-link
              to="/configuracion"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300"
              :class="isActiveRoute('/configuracion') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
              :title="!isExpanded ? 'Configuración' : ''"
            >
              <svg class="h-6 w-6 flex-shrink-0" :class="isActiveRoute('/configuracion') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span 
                class="ml-4 transition-all duration-300 overflow-hidden whitespace-nowrap"
                :class="{ 'opacity-0 w-0': !isExpanded, 'opacity-100 w-auto': isExpanded }"
              >
                Configuración
              </span>
            </router-link>
          </div>
        </div>
      </nav>
    </div>

    <!-- Overlay para móvil -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Contenido principal -->
    <div 
      class="flex flex-col flex-1 transition-all duration-300"
      :class="{ 'lg:pl-16': !isExpanded, 'lg:pl-64': isExpanded }"
    >
      <!-- Barra superior -->
      <div class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <!-- Botón del menú móvil -->
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          @click="toggleSidebar"
        >
          <span class="sr-only">Abrir sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Separador -->
        <div class="h-6 w-px bg-gray-200 lg:hidden" />

        <!-- Contenido de la barra superior -->
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <!-- Barra de búsqueda -->
          <form class="relative flex flex-1" action="#" method="GET">
            <label for="search-field" class="sr-only">Buscar</label>
            <svg class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
            <input
              id="search-field"
              class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Buscar productos, clientes..."
              type="search"
              name="search"
              v-model="searchQuery"
            />
          </form>

          <!-- Acciones de la derecha -->
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Notificaciones -->
            <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">Ver notificaciones</span>
              <div class="relative">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <!-- Indicador de notificaciones -->
                <span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </div>
            </button>

            <!-- Separador -->
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

            <!-- Menú de perfil -->
            <div class="relative">
              <button
                type="button"
                class="-m-1.5 flex items-center p-1.5"
                @click="toggleProfileMenu"
              >
                <span class="sr-only">Abrir menú de usuario</span>
                <img
                  class="h-8 w-8 rounded-full bg-gray-50"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Avatar del usuario"
                />
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm font-semibold leading-6 text-gray-900">{{ currentUser.name }}</span>
                  <svg class="ml-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                  </svg>
                </span>
              </button>

              <!-- Dropdown del perfil -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="profileMenuOpen"
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                >
                  <a href="#" class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50">Tu perfil</a>
                  <a href="#" @click="logout" class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50">Cerrar sesión</a>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Área de contenido principal -->
      <main class="flex-1">
        <div class="py-6">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RouterView />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'



// Estado reactivo
const sidebarOpen = ref(window.innerWidth >= 1024) // Abierto por defecto en desktop
const sidebarExpanded = ref(false) // Contraído por defecto
const profileMenuOpen = ref(false)
const searchQuery = ref('')
const facturaSubmenuOpen = ref(false) // Nueva variable para el submenu de factura

// Computed property para determinar si el sidebar está expandido
const isExpanded = computed(() => {
  return window.innerWidth < 1024 ? sidebarOpen.value : sidebarExpanded.value
})

// Datos del usuario currentUser
const currentUser = ref({
  name: 'Juan Pérez',
  email: 'juan@farmacia.com',
  role: 'Administrador'
})

// Funciones
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const closeProfileMenu = () => {
  profileMenuOpen.value = false
}

const logout = () => {
  // Lógica de cierre de sesión
  console.log('Cerrando sesión...')
  // Aquí puedes agregar la lógica para cerrar sesión
}

const toggleFacturaSubmenu = () => {
  facturaSubmenuOpen.value = !facturaSubmenuOpen.value
}

// Funciones para manejar la expansión del sidebar
const handleMouseEnter = () => {
  if (window.innerWidth >= 1024) {
    sidebarExpanded.value = true
  }
}

const handleMouseLeave = () => {
  if (window.innerWidth >= 1024) {
    sidebarExpanded.value = false
  }
}

// Función para determinar si una ruta está activa
const route = useRoute()
const isActiveRoute = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Cerrar menús al hacer clic fuera
const handleClickOutside = (event) => {
  if (profileMenuOpen.value && !event.target.closest('.relative')) {
    closeProfileMenu()
  }
}

// Cerrar sidebar en pantallas grandes
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true // Mantener abierto en desktop
  } else {
    sidebarOpen.value = false // Cerrar en móvil
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>