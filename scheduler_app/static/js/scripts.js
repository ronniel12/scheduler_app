document.addEventListener('DOMContentLoaded', function() {
    // Add Employee Form Submission
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addEmployeeForm);
            fetch('/api/crud/employee', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    location.reload();
                }
            });
        });
    }

    // Add Shift Form Submission
    const addShiftForm = document.getElementById('addShiftForm');
    if (addShiftForm) {
        addShiftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addShiftForm);
            fetch('/api/crud/shift', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    location.reload();
                }
            });
        });
    }

    // Add Task Form Submission
    const addTaskForm = document.getElementById('addTaskForm');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addTaskForm);
            fetch('/api/crud/task', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    location.reload();
                }
            });
        });
    }

    // Add Day Off Request Form Submission
    const addDayOffRequestForm = document.getElementById('addDayOffRequestForm');
    if (addDayOffRequestForm) {
        addDayOffRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addDayOffRequestForm);
            fetch('/api/crud/day_off_request', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    location.reload();
                }
            });
        });
    }

    // Schedule Settings Form Submission
    const scheduleSettingsForm = document.getElementById('scheduleSettingsForm');
    if (scheduleSettingsForm) {
        scheduleSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(scheduleSettingsForm);
            fetch('/api/crud/schedule_settings', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Settings saved successfully!');
                }
            });
        });
    }

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-employee, .delete-shift, .delete-task, .delete-day-off-request');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const type = this.classList[1].split('-')[1];
            if (confirm(`Are you sure you want to delete this ${type}?`)) {
                fetch(`/api/crud/${type}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: id})
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        location.reload();
                    }
                });
            }
        });
    });

    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-employee, .edit-shift, .edit-task, .edit-day-off-request');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const type = this.classList[1].split('-')[1];
            // Fetch the current data and populate a form for editing
            fetch(`/api/crud/${type}?id=${id}`)
            .then(response => response.json())
            .then(data => {
                // Create and show a modal with a pre-filled form for editing
                showEditModal(type, data);
            });
        });
    });
});

function showEditModal(type, data) {
    // Create a modal with a form pre-filled with the data
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit ${type}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        ${createFormFields(type, data)}
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    const editForm = document.getElementById('editForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(editForm);
        formData.append('id', data.id);
        fetch(`/api/crud/${type}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                modalInstance.hide();
                location.reload();
            }
        });
    });
}

function createFormFields(type, data) {
    let fields = '';
    switch (type) {
        case 'employee':
            fields = `
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" value="${data.name}" required>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="is_supervisor" name="is_supervisor" ${data.is_supervisor ? 'checked' : ''}>
                    <label class="form-check-label" for="is_supervisor">Is Supervisor</label>
                </div>
                <div class="mb-3">
                    <label for="skills" class="form-label">Skills</label>
                    <select multiple class="form-select" id="skills" name="skills">
                        ${createSkillOptions(data.skills)}
                    </select>
                </div>
            `;
            break;
        case 'shift':
            fields = `
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" value="${data.name}" required>
                </div>
                <div class="mb-3">
                    <label for="start_time" class="form-label">Start Time</label>
                    <input type="time" class="form-control" id="start_time" name="start_time" value="${data.start_time}" required>
                </div>
                <div class="mb-3">
                    <label for="end_time" class="form-label">End Time</label>
                    <input type="time" class="form-control" id="end_time" name="end_time" value="${data.end_time}" required>
                </div>
            `;
            break;
        case 'task':
            fields = `
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" value="${data.name}" required>
                </div>
                <div class="mb-3">
                    <label for="required_skill" class="form-label">Required Skill</label>
                    <select class="form-select" id="required_skill" name="required_skill" required>
                        ${createSkillOptions([data.required_skill])}
                    </select>
                </div>
            `;
            break;
        case 'day_off_request':
            fields = `
                <div class="mb-3">
                    <label for="employee" class="form-label">Employee</label>
                    <select class="form-select" id="employee" name="employee" required>
                        ${createEmployeeOptions(data.employee)}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="date" class="form-label">Date</label>
                    <input type="date" class="form-control" id="date" name="date" value="${data.date}" required>
                </div>
            `;
            break;
    }
    return fields;
}

function createSkillOptions(selectedSkills) {
    // This function should return HTML options for skills
    // You'll need to fetch all skills from the server and create options
    // marking the selectedSkills as selected
}

function createEmployeeOptions(selectedEmployee) {
    // This function should return HTML options for employees
    // You'll need to fetch all employees from the server and create options
    // marking the selectedEmployee as selected
}