// Existing code for modal creation and event listeners
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const messageContainer = document.getElementById('messageContainer');
    const BASE_URL = 'http://localhost:5001';

    // Modal creation function
    function createModal() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        document.body.appendChild(modal);

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modal.appendChild(modalContent);

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        modalContent.appendChild(modalHeader);

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalContent.appendChild(modalBody);

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        modalContent.appendChild(modalFooter);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modalHeader.appendChild(closeButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.display = 'none';
        modalFooter.appendChild(saveButton);

        return { modal, modalBody, modalHeader, modalFooter, saveButton };
    }

    const { modal, modalBody, modalHeader, modalFooter, saveButton } = createModal();

    // Existing code for loading tasks, adding tasks, and handling modals
    // Ensure that modal functionality and fetch calls are integrated correctly
});
