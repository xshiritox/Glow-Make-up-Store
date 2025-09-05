<template>
  <div ref="paypalButtonRef" class="paypal-button-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { loadScript } from '@paypal/paypal-js';

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: 'VIP Membership Upgrade'
  },
  currency: {
    type: String,
    default: 'USD'
  }
});

const emit = defineEmits(['payment-success', 'payment-error', 'payment-cancel']);

const paypalButtonRef = ref<HTMLElement | null>(null);
const isLoading = ref(true);
// Error state is declared but not used in the template, so we can remove it
// const error = ref<string | null>(null);

// This would be replaced with your actual PayPal client ID from environment variables
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';

onMounted(async () => {
  try {
    const paypal = await loadScript({ 
      clientId: paypalClientId,
      currency: props.currency,
    });

    if (paypal && paypal.Buttons) {
      await paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'pill',
          label: 'pay',
          height: 40
        },
        createOrder: (_data: unknown, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: props.description,
              amount: {
                value: props.amount,
                currency_code: props.currency
              }
            }]
          });
        },
onApprove: async (_data: unknown, actions: any) => {
          try {
            const details = await actions.order.capture();
            emit('payment-success', details);
          } catch (err) {
            console.error('Error capturing payment:', err);
            emit('payment-error', err);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          emit('payment-error', err);
        },
        onCancel: (data: any) => {
          emit('payment-cancel', data);
        }
      }).render(paypalButtonRef.value!);
    }
  } catch (error) {
    console.error('Failed to load PayPal:', error);
    // Error state is not used in the template
    console.error('Failed to load PayPal:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.paypal-button-container {
  min-width: 200px;
  min-height: 40px;
}
</style>
