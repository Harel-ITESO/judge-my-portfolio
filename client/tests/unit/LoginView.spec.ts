import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginView from '../../src/views/auth/LoginView.vue';

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    apiUrl: 'http://localhost/api',
  }),
}));

vi.mock('@/components/FormInput.vue', () => ({
  default: {
    name: 'FormInput',
    props: ['icon', 'vModel', 'type', 'placeholder', 'disabled'],
    template: `<input :type="type" :placeholder="placeholder" :disabled="disabled" v-model="vModel" />`,
  },
}));

describe('LoginView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders the login form and validates input', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
      },
    });

    // Prueba elementos del formulario
    const emailInput = wrapper.find('input[type="text"]');
    const passwordInput = wrapper.find('input[type="password"]');
    const submitButton = wrapper.find('button[type="submit"]');

    // Comprueba los elementos
    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
    expect(submitButton.exists()).toBe(true);

    //Espera respuesta de los elementos
    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');
    await submitButton.trigger('click');

    //Esperar a la accion de los formularios
    expect(wrapper.find('form').attributes('action')).toBeUndefined(); 
  });
});



