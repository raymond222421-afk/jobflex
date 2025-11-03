// Initialize Firebase (make sure you have this config in your script.js)
// const firebaseConfig = { ... };

document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    let currentUser = null;

    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        currentUser = user;
        loadUserProfile(user);
        loadApplications(user.uid);
        generateReferralLink(user.uid);
        setupEditProfile();
    });

    function loadUserProfile(user) {
        db.collection("users").doc(user.uid).get().then(doc => {
            if (!doc.exists) return;
            
            const userData = doc.data();
            const profileHTML = `
                <p><strong><i class="fas fa-user-circle"></i> Name:</strong> ${userData.name || 'Not set'}</p>
                <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${user.email}</p>
                <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${userData.phone || 'Not set'}</p>
                <p><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> ${userData.location || 'Not set'}</p>
                <p><strong><i class="fas fa-briefcase"></i> Profession:</strong> ${userData.profession || 'Not set'}</p>
            `;
            document.getElementById('userProfile').innerHTML = profileHTML;
        });
    }

    function loadApplications(userId) {
        db.collection("applications")
            .where("userId", "==", userId)
            .get()
            .then(snapshot => {
                const appsList = document.getElementById("applicationsList");
                appsList.innerHTML = snapshot.empty 
                    ? '<tr><td colspan="4" style="text-align: center;">No applications found</td></tr>'
                    : '';

                snapshot.forEach(doc => {
                    const app = doc.data();
                    const row = document.createElement("tr");
                    
                    row.innerHTML = `
                        <td>${app.jobTitle}</td>
                        <td>${app.company}</td>
                        <td class="status-${app.status.toLowerCase()}">
                            <select class="status-select" data-app-id="${doc.id}">
                                <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="processing" ${app.status === 'processing' ? 'selected' : ''}>Processing</option>
                                <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                                <option value="declined" ${app.status === 'declined' ? 'selected' : ''}>Declined</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" class="status-note" 
                                   value="${app.note || ''}" 
                                   placeholder="Add note..." 
                                   data-app-id="${doc.id}">
                        </td>
                    `;
                    appsList.appendChild(row);
                });

                // Add event listeners
                document.querySelectorAll('.status-select').forEach(select => {
                    select.addEventListener('change', (e) => {
                        updateApplication(e.target.dataset.appId, {
                            status: e.target.value
                        });
                    });
                });

                document.querySelectorAll('.status-note').forEach(input => {
                    input.addEventListener('change', (e) => {
                        updateApplication(e.target.dataset.appId, {
                            note: e.target.value
                        });
                    });
                });
            });
    }

    function updateApplication(appId, data) {
        db.collection("applications").doc(appId).update(data)
            .then(() => console.log("Application updated"))
            .catch(err => console.error("Error updating application:", err));
    }

    function generateReferralLink(userId) {
        const refLink = `${window.location.origin}/?ref=${userId}`;
        document.getElementById('referralLink').value = refLink;
    }

    function copyReferral() {
        const refInput = document.getElementById('referralLink');
        refInput.select();
        document.execCommand('copy');
        
        // Show feedback
        const copyBtn = document.querySelector('.btn-copy');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }

    function setupEditProfile() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-edit-profile')) {
                db.collection("users").doc(currentUser.uid).get().then(doc => {
                    const userData = doc.data();
                    
                    const newName = prompt("Enter your full name:", userData.name || '');
                    if (newName === null) return;
                    
                    const newPhone = prompt("Enter your phone number:", userData.phone || '');
                    const newLocation = prompt("Enter your location:", userData.location || '');
                    const newProfession = prompt("Enter your profession:", userData.profession || '');
                    
                    const updates = {
                        name: newName,
                        phone: newPhone,
                        location: newLocation,
                        profession: newProfession,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    db.collection("users").doc(currentUser.uid).update(updates)
                        .then(() => {
                            alert("Profile updated successfully!");
                            loadUserProfile(currentUser);
                        })
                        .catch(err => {
                            console.error("Error updating profile:", err);
                            alert("Error updating profile. Please try again.");
                        });
                });
            }
        });
    }
});