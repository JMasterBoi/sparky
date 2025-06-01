import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// default swal configuration
const mySwal = withReactContent(Swal).mixin({
  theme: 'dark',
  background: 'var(--background)',
  color: 'var(--text)',
});
// toast configuration
const toast = mySwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
})

export const successToast = (title = 'Success!') => {
  toast.fire({
    icon: 'success',
    title,
    // :3 Audrey's theme 
    // iconColor: '#d16d9d',
  });
};
export const errorToast = (title = 'Error!') => {
  toast.fire({
    icon: 'error',
    title
  });
};

// form module inside the alert
// function createGoalForm() {
//   return (
//     <form>
//       <input type="text" placeholder="Goal Name" id="goalName" />
//       <input type="text" placeholder="Quick Goal Description" id="goalDescription" />
//     </form>
//   );
// }
// export const createGoal = () => {
//   mySwal.fire({
//     title: "Create a new goal",
//     html: <createGoalForm />
//   });
// };

export const createGoal = (reloadGoals) => {

  mySwal.fire({
    title: 'Create Goal',
    html: <div >
      <input style={{fontFamily: 'var(--font)'}} autoComplete="off" type="text" id="goalName" className="swal2-input" placeholder="Goal Name" />
      {/* <br /> */}
      <textarea style={{fontFamily: 'var(--font)'}} id="goalDescription" className="swal2-textarea" placeholder="Description" />
    </div>,
    // showCancelButton: true,
    confirmButtonText: 'Add',
    focusConfirm: false,
    preConfirm: () => {
      const goalName = document.getElementById('goalName').value;
      const goalDescription = document.getElementById('goalDescription').value;

      if (!goalName) {
        Swal.showValidationMessage('Please enter a goal name');
        return false;
      }

      return { goalName, goalDescription };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // send the goal data to the server
      axios.post('/api/create-goal', {
        goalName: result.value.goalName,
        goalDescription: result.value.goalDescription
      }).then(() => {
        successToast('Goal created successfully!');
        reloadGoals()
      })
    }
  });
};

