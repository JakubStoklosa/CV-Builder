document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeEventListeners();
    updatePreview();
});

function initializeEventListeners() {
    // Form input listeners for real-time preview
    const formInputs = document.querySelectorAll('#cv-form input, #cv-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Button listeners
    document.getElementById('load-example').addEventListener('click', loadExampleData);
    document.getElementById('download-pdf').addEventListener('click', downloadPDF);
    document.getElementById('add-project').addEventListener('click', addProject);
    document.getElementById('add-experience').addEventListener('click', addExperience);
}

function loadExampleData() {
    const data = window.EXAMPLE_DATA;
    
    // Fill personal information
    document.getElementById('name').value = data.name || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('location').value = data.location || '';
    
    // Fill links
    document.getElementById('linkedin').value = data.linkedin || '';
    document.getElementById('github').value = data.github || '';
    document.getElementById('portfolio').value = data.portfolio || '';
    
    // Fill profile
    document.getElementById('profile').value = data.personal_statement || '';
    
    // Fill education
    document.getElementById('degree').value = data.degree || '';
    document.getElementById('university').value = data.university || '';
    document.getElementById('graduation_year').value = data.graduation_year || '';
    document.getElementById('grade').value = data.grade || '';
    
    // Fill skills
    document.getElementById('skills').value = data.skills ? data.skills.join(', ') : '';
    
    // Fill projects
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach((project, index) => {
            addProject();
            const projectItems = document.querySelectorAll('.project-item');
            const currentProject = projectItems[projectItems.length - 1];
            currentProject.querySelector('.project-title').value = project.title || '';
            currentProject.querySelector('.project-description').value = project.description || '';
            currentProject.querySelector('.project-technologies').value = project.technologies || '';
        });
    } else {
        addProject();
    }
    
    // Fill work experience
    const experienceContainer = document.getElementById('experience-container');
    experienceContainer.innerHTML = '';
    if (data.work_experience && data.work_experience.length > 0) {
        data.work_experience.forEach((job, index) => {
            addExperience();
            const experienceItems = document.querySelectorAll('.experience-item');
            const currentExperience = experienceItems[experienceItems.length - 1];
            currentExperience.querySelector('.experience-title').value = job.title || '';
            currentExperience.querySelector('.experience-company').value = job.company || '';
            currentExperience.querySelector('.experience-duration').value = job.duration || '';
            currentExperience.querySelector('.experience-description').value = job.description || '';
        });
    } else {
        addExperience();
    }
    
    // Update preview
    updatePreview();
}

function addProject() {
    const container = document.getElementById('projects-container');
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-item';
    projectDiv.innerHTML = `
        <input type="text" class="project-title" placeholder="Project Title">
        <textarea class="project-description" placeholder="Project Description"></textarea>
        <input type="text" class="project-technologies" placeholder="Technologies Used">
        <button type="button" class="remove-project" onclick="removeProject(this)">Remove</button>
    `;
    container.appendChild(projectDiv);
    
    // Add event listeners to new inputs
    const newInputs = projectDiv.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function addExperience() {
    const container = document.getElementById('experience-container');
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'experience-item';
    experienceDiv.innerHTML = `
        <input type="text" class="experience-title" placeholder="Job Title">
        <input type="text" class="experience-company" placeholder="Company Name">
        <input type="text" class="experience-duration" placeholder="Duration (e.g., Jun 2023 - Aug 2023)">
        <textarea class="experience-description" placeholder="Job Description"></textarea>
        <button type="button" class="remove-experience" onclick="removeExperience(this)">Remove</button>
    `;
    container.appendChild(experienceDiv);
    
    // Add event listeners to new inputs
    const newInputs = experienceDiv.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeProject(button) {
    const projectItem = button.parentElement;
    projectItem.remove();
    updatePreview();
}

function removeExperience(button) {
    const experienceItem = button.parentElement;
    experienceItem.remove();
    updatePreview();
}

function collectFormData() {
    // Collect basic information
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        portfolio: document.getElementById('portfolio').value,
        profile: document.getElementById('profile').value,
        degree: document.getElementById('degree').value,
        university: document.getElementById('university').value,
        graduation_year: document.getElementById('graduation_year').value,
        grade: document.getElementById('grade').value,
        skills: []
    };
    
    // Process skills
    const skillsText = document.getElementById('skills').value;
    if (skillsText.trim()) {
        data.skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
    
    // Collect projects
    data.projects = [];
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        const title = item.querySelector('.project-title').value.trim();
        const description = item.querySelector('.project-description').value.trim();
        const technologies = item.querySelector('.project-technologies').value.trim();
        
        if (title || description || technologies) {
            data.projects.push({
                title,
                description,
                technologies
            });
        }
    });
    
    // Collect work experience
    data.work_experience = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const title = item.querySelector('.experience-title').value.trim();
        const company = item.querySelector('.experience-company').value.trim();
        const duration = item.querySelector('.experience-duration').value.trim();
        const description = item.querySelector('.experience-description').value.trim();
        
        if (title || company || duration || description) {
            data.work_experience.push({
                title,
                company,
                duration,
                description
            });
        }
    });
    
    return data;
}

async function updatePreview() {
    const data = collectFormData();
    const previewContainer = document.getElementById('cv-preview');
    
    try {
        const response = await fetch('/api/generate-cv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            previewContainer.innerHTML = result.html;
        } else {
            previewContainer.innerHTML = '<p class="error">Error generating preview: ' + result.error + '</p>';
        }
    } catch (error) {
        console.error('Error updating preview:', error);
        previewContainer.innerHTML = '<p class="error">Error connecting to server</p>';
    }
}

async function downloadPDF() {
    const cvContent = document.getElementById('cv-content');
    
    if (!cvContent) {
        alert('Please fill in some information first to generate a CV preview.');
        return;
    }
    
    try {
        // Show loading state
        const downloadBtn = document.getElementById('download-pdf');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generating PDF...';
        downloadBtn.disabled = true;
        
        // Use html2canvas to capture the CV content
        const canvas = await html2canvas(cvContent, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: cvContent.scrollWidth,
            height: cvContent.scrollHeight
        });
        
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calculate dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        // Add first page
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Generate filename with current date
        const name = document.getElementById('name').value || 'CV';
        const date = new Date().toISOString().split('T')[0];
        const filename = `${name.replace(/\s+/g, '_')}_CV_${date}.pdf`;
        
        // Download the PDF
        pdf.save(filename);
        
        // Reset button state
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        
        // Reset button state
        const downloadBtn = document.getElementById('download-pdf');
        downloadBtn.textContent = '📄 Download PDF';
        downloadBtn.disabled = false;
    }
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Auto-save functionality (optional enhancement)
function autoSave() {
    const data = collectFormData();
    localStorage.setItem('cv_builder_data', JSON.stringify(data));
}

function loadAutoSave() {
    const savedData = localStorage.getItem('cv_builder_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            // Load the saved data into the form
            // This is similar to loadExampleData but with saved data
            loadDataIntoForm(data);
        } catch (error) {
            console.error('Error loading auto-saved data:', error);
        }
    }
}

function loadDataIntoForm(data) {
    // Fill personal information
    document.getElementById('name').value = data.name || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('location').value = data.location || '';
    
    // Fill links
    document.getElementById('linkedin').value = data.linkedin || '';
    document.getElementById('github').value = data.github || '';
    document.getElementById('portfolio').value = data.portfolio || '';
    
    // Fill profile
    document.getElementById('profile').value = data.profile || '';
    
    // Fill education
    document.getElementById('degree').value = data.degree || '';
    document.getElementById('university').value = data.university || '';
    document.getElementById('graduation_year').value = data.graduation_year || '';
    document.getElementById('grade').value = data.grade || '';
    
    // Fill skills
    document.getElementById('skills').value = data.skills ? data.skills.join(', ') : '';
    
    // Fill projects
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach((project) => {
            addProject();
            const projectItems = document.querySelectorAll('.project-item');
            const currentProject = projectItems[projectItems.length - 1];
            currentProject.querySelector('.project-title').value = project.title || '';
            currentProject.querySelector('.project-description').value = project.description || '';
            currentProject.querySelector('.project-technologies').value = project.technologies || '';
        });
    } else {
        addProject();
    }
    
    // Fill work experience
    const experienceContainer = document.getElementById('experience-container');
    experienceContainer.innerHTML = '';
    if (data.work_experience && data.work_experience.length > 0) {
        data.work_experience.forEach((job) => {
            addExperience();
            const experienceItems = document.querySelectorAll('.experience-item');
            const currentExperience = experienceItems[experienceItems.length - 1];
            currentExperience.querySelector('.experience-title').value = job.title || '';
            currentExperience.querySelector('.experience-company').value = job.company || '';
            currentExperience.querySelector('.experience-duration').value = job.duration || '';
            currentExperience.querySelector('.experience-description').value = job.description || '';
        });
    } else {
        addExperience();
    }
    
    // Update preview
    updatePreview();
}

// Enable auto-save every 30 seconds
setInterval(autoSave, 30000);

// Load auto-saved data on page load (uncomment if desired)
// window.addEventListener('load', loadAutoSave);