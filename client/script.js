const API_URL = 'http://localhost:5001/api';

// Submit loan application form
async function submitForm(event) {
    event.preventDefault();
    
    const formData = {
        applicant_id: document.getElementById('applicantId').value,
        applicant_income: parseFloat(document.getElementById('applicantIncome').value),
        coapplicant_income: parseFloat(document.getElementById('coapplicantIncome').value),
        employment_status: document.getElementById('employmentStatus').value,
        age: parseInt(document.getElementById('age').value),
        marital_status: document.getElementById('maritalStatus').value,
        dependents: parseInt(document.getElementById('dependents').value),
        credit_score: parseInt(document.getElementById('creditScore').value),
        existing_loans: parseInt(document.getElementById('existingLoans').value),
        loan_amount: parseFloat(document.getElementById('loanAmount').value),
        loan_term: parseInt(document.getElementById('loanTerm').value),
        home_ownership: document.getElementById('homeOwnership').value,
        years_employed: parseInt(document.getElementById('yearsEmployed').value),
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    const messageDiv = document.getElementById('formMessage');
    messageDiv.style.display = 'block';
    messageDiv.className = 'message info';
    messageDiv.textContent = '⏳ Submitting your application...';

    try {
        const response = await fetch(`${API_URL}/loans/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.innerHTML = `
                <strong>✅ Application Submitted Successfully!</strong><br>
                Your Applicant ID: <strong>${data.application.applicant_id}</strong><br>
                Status: <strong>${data.application.status}</strong><br>
                ${data.application.prediction ? `Prediction: <strong>${data.application.prediction}</strong> (${data.application.confidence_score}% confidence)` : 'Your application is being processed...'}
            `;
            document.getElementById('loanForm').reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = `❌ Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = `❌ Error submitting application: ${error.message}`;
    }
}

// Check application status
function checkStatus() {
    document.getElementById('statusModal').style.display = 'flex';
}

// Fetch status
async function fetchStatus() {
    const applicantId = document.getElementById('applicantId').value.trim();
    const resultDiv = document.getElementById('statusResult');

    if (!applicantId) {
        resultDiv.innerHTML = '<div class="message error">Please enter an Applicant ID</div>';
        return;
    }

    resultDiv.innerHTML = '<div class="message info">🔍 Searching...</div>';

    try {
        const response = await fetch(`${API_URL}/loans/${applicantId}`);
        const data = await response.json();

        if (response.ok) {
            const statusColor = data.status === 'Approved' ? 'success' : 
                               data.status === 'Rejected' ? 'error' : 'info';
            
            resultDiv.innerHTML = `
                <div class="status-info">
                    <div class="status-row">
                        <span class="status-label">Applicant ID:</span>
                        <span class="status-value">${data.applicant_id}</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Status:</span>
                        <span class="status-value">${data.status}</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Loan Amount:</span>
                        <span class="status-value">₹${data.loan_amount.toLocaleString()}</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Application Date:</span>
                        <span class="status-value">${new Date(data.created_at).toLocaleDateString()}</span>
                    </div>
                    ${data.prediction ? `
                    <div class="status-row">
                        <span class="status-label">Prediction:</span>
                        <span class="status-value">${data.prediction}</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Confidence:</span>
                        <span class="status-value">${data.confidence_score}%</span>
                    </div>
                    ` : ''}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="message error">❌ ${data.error}</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `<div class="message error">❌ Error: ${error.message}</div>`;
    }
}

// Show about modal
function showAbout() {
    document.getElementById('aboutModal').style.display = 'flex';
}

// Close modals
function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
    document.getElementById('statusResult').innerHTML = '';
    document.getElementById('applicantId').value = '';
}

function closeAboutModal() {
    document.getElementById('aboutModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const statusModal = document.getElementById('statusModal');
    const aboutModal = document.getElementById('aboutModal');
    
    if (event.target === statusModal) {
        statusModal.style.display = 'none';
    }
    if (event.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
}

// Form validation
function validateForm() {
    const form = document.getElementById('loanForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const income = parseFloat(document.getElementById('applicantIncome').value);
            const loanAmount = parseFloat(document.getElementById('loanAmount').value);
            
            if (loanAmount > income * 10) {
                e.preventDefault();
                alert('Warning: Loan amount seems too high compared to your income.');
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    validateForm();
    console.log('✅ CreditWise Application Loaded');
    console.log(`📡 API URL: ${API_URL}`);
});
