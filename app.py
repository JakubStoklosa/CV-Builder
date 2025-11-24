from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# Sample data for testing
EXAMPLE_DATA = {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "+44 7700 900123",
    "location": "London, UK",
    "linkedin": "linkedin.com/in/sarahjohnson",
    "github": "github.com/sarahjohnson",
    "portfolio": "sarahjohnson.dev",
    "personal_statement": "Recent Computer Science graduate with a passion for full-stack development and machine learning. Experienced in building scalable web applications using modern technologies. Seeking a graduate software developer role where I can contribute to innovative projects while continuing to develop my technical skills in a collaborative environment.",
    "degree": "BSc Computer Science",
    "university": "University of Manchester",
    "graduation_year": "2024",
    "grade": "First Class Honours",
    "projects": [
        {
            "title": "E-commerce Platform",
            "description": "Full-stack web application built with React and Node.js, featuring user authentication, payment integration, and real-time inventory management.",
            "technologies": "React, Node.js, MongoDB, Stripe API, Socket.io"
        },
        {
            "title": "Machine Learning Stock Predictor",
            "description": "Python application using LSTM neural networks to predict stock prices, achieving 85% accuracy on test data.",
            "technologies": "Python, TensorFlow, Pandas, NumPy, Matplotlib"
        },
        {
            "title": "Mobile Fitness Tracker",
            "description": "Cross-platform mobile app for tracking workouts and nutrition, with social features and progress analytics.",
            "technologies": "React Native, Firebase, Redux, Chart.js"
        }
    ],
    "work_experience": [
        {
            "title": "Software Development Intern",
            "company": "TechStart Solutions",
            "duration": "Jun 2023 - Aug 2023",
            "description": "Developed REST APIs using Python and Flask, collaborated with senior developers on client projects, and improved application performance by 30%."
        }
    ],
    "skills": [
        "Python", "JavaScript", "React", "Node.js", "MongoDB", "SQL", 
        "Git", "Docker", "AWS", "Machine Learning", "TensorFlow", "Flask"
    ]
}

@app.route('/')
def index():
    """Main page with CV builder form"""
    return render_template('index.html', example_data=EXAMPLE_DATA)

@app.route('/api/generate-cv', methods=['POST'])
def generate_cv():
    """API endpoint to generate CV HTML"""
    try:
        data = request.get_json()
        # Render CV template with user data
        cv_html = render_template('cv_template.html', data=data)
        return jsonify({'success': True, 'html': cv_html})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/example-data')
def get_example_data():
    """API endpoint to get example data"""
    return jsonify(EXAMPLE_DATA)

if __name__ == '__main__':
    app.run(debug=True)