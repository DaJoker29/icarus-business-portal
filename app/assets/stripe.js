/* global Stripe */

$(document).ready(() => {
  const stripe = Stripe('pk_test_Y2VguBuQWSSVDls1y3LpyouT');
  const elements = stripe.elements();

  const style = {
    base: {
      fontSize: '24px',
      color: '#111',
    },
  };
  const card = elements.create('card', { style });

  card.mount('#stripe-container');

  card.addEventListener('change', ({ error }) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  });

  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const { token, error } = await stripe.createToken(card);

    if (error) {
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      stripeTokenHandler(token);
    }
  });
});

function stripeTokenHandler(token) {
  const form = document.getElementById('payment-form');
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  form.submit();
}
