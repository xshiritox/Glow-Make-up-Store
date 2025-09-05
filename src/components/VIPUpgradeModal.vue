<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <IconCrown class="h-6 w-6 text-yellow-600" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                    Actualizar a VIP
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Desbloquea características exclusivas convirtiéndote en miembro VIP por solo $9.99 USD al mes.
                    </p>
                    <ul class="mt-4 space-y-2 text-sm text-gray-600">
                      <li class="flex items-center">
                        <IconCheck class="h-5 w-5 text-green-500 mr-2" />
                        <span>Destaca tus publicaciones</span>
                      </li>
                      <li class="flex items-center">
                        <IconCheck class="h-5 w-5 text-green-500 mr-2" />
                        <span>Hasta 20 imágenes por publicación</span>
                      </li>
                      <li class="flex items-center">
                        <IconCheck class="h-5 w-5 text-green-500 mr-2" />
                        <span>Soporte prioritario</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <PayPalButton 
                  :amount="9.99"
                  description="Suscripción VIP mensual"
                  currency="USD"
                  @payment-success="handlePaymentSuccess"
                  @payment-error="handlePaymentError"
                  @payment-cancel="handlePaymentCancel"
                />
              </div>

              <div v-if="isLoading" class="mt-4 text-center">
                <p class="text-sm text-gray-500">Procesando pago...</p>
              </div>

              <div v-if="error" class="mt-4 p-3 bg-red-50 rounded-md">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="closeModal"
                  :disabled="isLoading"
                >
                  Cerrar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { Crown as IconCrown, Check as IconCheck } from 'lucide-vue-next';
import PayPalButton from './PayPalButton.vue';
import { useToast } from 'vue-toastification';
import { useAuth } from '../composables/useAuth';

const { updateProfile } = useAuth();
const toast = useToast();

// Define props without assignment since we don't reference them in script but they're used in template
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close']);

const isLoading = ref(false);
const error = ref<string | null>(null);

const closeModal = () => {
  if (!isLoading.value) {
    emit('close');
  }
};

const handlePaymentSuccess = async (_details: unknown) => {
  try {
    isLoading.value = true;
    // Update user's profile to VIP
    await updateProfile({ badge: 'vip' });
    toast.success('¡Felicidades! Ahora eres un usuario VIP');
    closeModal();
    // Refresh the page to show the new VIP status
    window.location.reload();
  } catch (err) {
    console.error('Error updating profile:', err);
    error.value = 'Error al actualizar tu perfil. Por favor, contacta al soporte.';
  } finally {
    isLoading.value = false;
  }
};

const handlePaymentError = (err: any) => {
  console.error('Payment error:', err);
  error.value = 'Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.';
  isLoading.value = false;
};

const handlePaymentCancel = () => {
  toast.info('Pago cancelado');
  closeModal();
};
</script>
