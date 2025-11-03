document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        // Check if admin
        db.collection('users').doc(user.uid).get().then(doc => {
            if (!doc.exists || doc.data().role !== 'admin') {
                alert('Access denied');
                window.location.href = 'index.html';
                return;
            }
            
            loadUsers();
            loadJobs();
        });
    });
    
    function loadUsers() {
        db.collection('users').get().then(snapshot => {
            const usersList = document.getElementById('usersList');
            if (snapshot.empty) {
                usersList.innerHTML = '<p>No users found</p>';
                return;
            }
            
            let html = '<table><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>';
            snapshot.forEach(doc => {
                const user = doc.data();
                html += `
                    <tr>
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.email}</td>
                        <td>${user.role || 'user'}</td>
                        <td>
                            <button class="btn-manage-user" data-uid="${doc.id}">Manage</button>
                        </td>
                    </tr>
                `;
            });
            html += '</table>';
            usersList.innerHTML = html;
        });
    }
    
    function loadJobs() {
        db.collection('jobs').get().then(snapshot => {
            const jobsList = document.getElementById('jobsList');
            if (snapshot.empty) {
                jobsList.innerHTML = '<p>No jobs found</p>';
                return;
            }
            
            let html = '<table><tr><th>Title</th><th>Company</th><th>Actions</th></tr>';
            snapshot.forEach(doc => {
                const job = doc.data();
                html += `
                    <tr>
                        <td>${job.title}</td>
                        <td>${job.company}</td>
                        <td>
                            <button class="btn-edit-job" data-jobid="${doc.id}">Edit</button>
                            <button class="btn-delete-job" data-jobid="${doc.id}">Delete</button>
                        </td>
                    </tr>
                `;
            });
            html += '</table>';
            jobsList.innerHTML = html;
        });
    }
});