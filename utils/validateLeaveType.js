function validateLeaveBalances(leaveBalances) {

    console.log("Validating leave balances:", leaveBalances);
    const validLeaveTypes = ['earned_leave', 'sick_leave', 'maternity_leave', 'optional_leave', 'loss_of_pay', 'work_from_home'];
  
    return Object.keys(leaveBalances).every(key => 
      validLeaveTypes.includes(key) && 
      (leaveBalances[key] === null || typeof leaveBalances[key] === 'number')
    );
  }
  
  module.exports = {validateLeaveBalances}