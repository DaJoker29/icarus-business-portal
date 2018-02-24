$(function() {
  setPlan();
  $('#hosting-plan').change(setPlan);
});

function setPlan() {
  if ($('#hosting-plan').val() === 'hands-off') {
    $('#plan_title').html('1 year of Hands-Off Hosting');
    $('#plan_total').html('$300');
  } else if ($('#hosting-plan').val() === 'maintain') {
    $('#plan_title').html('1 year of Maintain Hosting');
    $('#plan_total').html('$425');
  } else if ($('#hosting-plan').val() === 'hands-on') {
    $('#plan_title').html('1 year of Hands-On Hosting');
    $('#plan_total').html('$550');
  }
}
