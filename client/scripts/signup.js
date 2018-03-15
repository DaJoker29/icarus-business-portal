$(() => {
  if ($('#hardware').length && $('#support-plan').length) {
    setPlan();
    $('#hardware').change(setPlan);
    $('#support-plan').change(setPlan);
  }
});

function setPlan() {
  // Set Hardware
  if ($('#hardware').val() === 'starter') {
    $('#hardware_title').html('1 year of Starter Hosting');
    $('#hardware_price').html('$195');
  } else if ($('#hardware').val() === 'business') {
    $('#hardware_title').html('1 year of Business Hosting');
    $('#hardware_price').html('$295');
  } else if ($('#hardware').val() === 'developer') {
    $('#hardware_title').html('1 year of Developer Hosting');
    $('#hardware_price').html('$495');
  } else {
    console.log('Not Selected');
  }

  // Set Support Plan
  if ($('#support-plan').val() === 'hands-off') {
    $('#support_title').html('1 year of Hands-Off Support');
    $('#support_price').html('Free');
  } else if ($('#support-plan').val() === 'maintain') {
    $('#support_title').html('1 year of Maintain Support');
    $('#support_price').html('$125');
  } else if ($('#support-plan').val() === 'hands-on') {
    $('#support_title').html('1 year of Hands-On Support');
    $('#support_price').html('$375');
  } else {
    console.log('Not Selected');
  }
}
