$(function() {
  setPlan();
  $('#hosting-plan').change(setPlan);
});

function setPlan() {
  if ($('#hosting-plan').val() === 'starter') {
    $('#plan_title').html('Starter Plan');
    $('#plan_total').html('$195');
  } else if ($('#hosting-plan').val() === 'prosumer') {
    $('#plan_title').html('Prosumer Plan');
    $('#plan_total').html('$295');
  }
}
