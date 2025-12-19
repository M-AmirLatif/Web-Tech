$(function () {
  const $form = $('#checkoutForm');
  const $btn  = $('#placeOrderBtn');

const emailRe  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const postalRe = /^[0-9]{4,6}$/;
const digits   = /^[0-9]+$/;
const cardRe   = /^[0-9]{13,19}$/;
const expiryRe = /^[0-9]{2}\/[0-9]{2}$/;

  const set = (ok, $el, msgSel, msg='') => {
    $el.toggleClass('is-invalid', !ok).toggleClass('is-valid', ok);
    if (msgSel) $(msgSel).text(ok ? '' : msg);
    return ok;
  };

  const futureExpiry = v => {
    if (!expiryRe.test(v)) return false;
    const [mm, yy] = v.split('/');
    const endOfMonth = new Date(2000 + +yy, +mm, 0, 23, 59, 59);
    const now = new Date();
    // Compare by year & month (expiry valid through the end of the MM/YY month)
    return (endOfMonth.getFullYear() > now.getFullYear()) ||
           (endOfMonth.getFullYear() === now.getFullYear() && endOfMonth.getMonth() >= now.getMonth());
  };

  const cardSelected = () => $('input[name="payment"]:checked').val() === 'card';

  // --- Field validators (each returns true/false and updates UI)
  const V = {
    fullName: () => set($('#fullName').val().trim().length >= 3, $('#fullName'), '#fullNameFeedback', 'Full name must be at least 3 characters.'),
    email:    () => set(emailRe.test($('#email').val().trim()), $('#email'), '#emailFeedback', 'Enter a valid email address.'),
    phone:    () => {
      const v = $('#phone').val().replace(/\D/g,'');
      return set(v.length >= 10 && digits.test(v), $('#phone'), '#phoneFeedback', 'Digits only, at least 10 digits.');
    },
    address:  () => set($('#address').val().trim() !== '', $('#address'), '#addressFeedback', 'Address is required.'),
    city:     () => set($('#city').val().trim() !== '', $('#city'), '#cityFeedback', 'City is required.'),
    postal:   () => set(postalRe.test($('#postal').val().trim()), $('#postal'), '#postalFeedback', 'Postal code must be 4–6 digits.'),
    country:  () => set(!!$('#country').val(), $('#country'), '#countryFeedback', 'Please select a country.'),
    payment:  () => {
      const ok = $('input[name="payment"]:checked').length > 0;
      $('#paymentGroup').toggleClass('is-invalid', !ok);
      $('#paymentFeedback').text(ok ? '' : 'Please select a payment method.');
      return ok;
    },
    // Card fields only required if "Card" is selected
    cardName:   () => !cardSelected() || set($('#cardName').val().trim().length >= 2, $('#cardName'), '#cardNameFeedback', 'Cardholder name is required.'),
    cardNumber: () => !cardSelected() || set(cardRe.test($('#cardNumber').val().replace(/-/g,' ').trim()), $('#cardNumber'), '#cardNumberFeedback', 'Enter a valid card number (13–19 digits).'),
    expiry:     () => !cardSelected() || set(futureExpiry($('#expiry').val().trim()), $('#expiry'), '#expiryFeedback', 'Use MM/YY and ensure it’s not expired.'),
    cvv:        () => !cardSelected() || set(/^\d{3,4}$/.test($('#cvv').val().trim()), $('#cvv'), '#cvvFeedback', 'CVV must be 3–4 digits.'),
    terms:      () => set($('#termsCheck').is(':checked'), $('#termsCheck'), '#termsFeedback', 'You must agree to the terms to continue.')
  };

  // --- Small UX niceties (formatting)
  $('#cardNumber').on('input', function(){
    let v = this.value.replace(/\D/g,'').slice(0,19);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    this.value = v;
  });
  $('#expiry').on('input', function(){
    let v = this.value.replace(/\D/g,'').slice(0,4);
    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    this.value = v;
  });
  $('#cvv').on('input', function(){ this.value = this.value.replace(/\D/g,'').slice(0,4); });

  // --- Enable/disable submit button tied to terms checkbox
  $('#termsCheck').on('change', function(){
    $btn.prop('disabled', !this.checked);
    V.terms();
  });

  // --- Revalidate inline on interaction (messages disappear once corrected)
  $('#fullName,#email,#phone,#address,#city,#postal,#country')
    .on('input change blur', function(){ V[this.id] && V[this.id](); });

  $('input[name="payment"]').on('change', function(){
    V.payment();
    // When switching payment method, re-check card field requirements
    V.cardName(); V.cardNumber(); V.expiry(); V.cvv();
    if (!cardSelected()) {
      $('#cardFields input').removeClass('is-invalid is-valid');
      $('#cardFields .invalid-feedback').text('');
    }
  });

  $('#cardName,#cardNumber,#expiry,#cvv')
    .on('input blur', function(){ V[this.id] && V[this.id](); });

  // --- Final submit: run ALL validators, block if any fail, smooth scroll to first error
  $form.on('submit', function(e){
    e.preventDefault(); // remove if doing a real post (but keep client-side check)

    const ok =
      V.fullName() & V.email() & V.phone() & V.address() & V.city() &
      V.postal() & V.country() & V.payment() & V.terms() &
      V.cardName() & V.cardNumber() & V.expiry() & V.cvv();

    if (!ok) {
      const $first = $('.is-invalid:visible').first();
      if ($first.length) {
        $('html, body').animate({ scrollTop: Math.max(0, $first.offset().top - 120) }, 350);
        $first.trigger('focus');
      }
      return;
    }

    // ✅ All validations passed — proceed (AJAX/submit) as needed
    alert('Form is valid ✅'); // replace with real submit logic
  });
});
