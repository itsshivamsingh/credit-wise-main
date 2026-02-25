from flask import Flask, request, jsonify
import pickle
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Load pre-trained model
try:
    model = joblib.load('model.pkl')
    logging.info('✅ Model loaded successfully')
except:
    logging.warning('⚠️ Model not found. Using simple prediction logic.')
    model = None

# Initialize label encoders for categorical features
le_employment = LabelEncoder()
le_employment.fit(['Salaried', 'Self-Employed'])

le_marital = LabelEncoder()
le_marital.fit(['Single', 'Married', 'Divorced'])

le_home = LabelEncoder()
le_home.fit(['Own', 'Mortgage', 'Rent'])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML API is running'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['applicant_income', 'coapplicant_income', 'employment_status',
                          'age', 'marital_status', 'dependents', 'credit_score',
                          'existing_loans', 'loan_amount', 'loan_term',
                          'home_ownership', 'years_employed']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Prepare features
        features = np.array([
            data['applicant_income'],
            data['coapplicant_income'],
            le_employment.transform([data['employment_status']])[0],
            data['age'],
            le_marital.transform([data['marital_status']])[0],
            data['dependents'],
            data['credit_score'],
            data['existing_loans'],
            data['loan_amount'],
            data['loan_term'],
            le_home.transform([data['home_ownership']])[0],
            data['years_employed']
        ]).reshape(1, -1)

        # Make prediction
        if model:
            prediction = model.predict(features)[0]
            confidence = float(max(model.predict_proba(features)[0])) * 100
        else:
            # Simple heuristic if model not available
            total_income = data['applicant_income'] + data['coapplicant_income']
            debt_to_income = data['loan_amount'] / (total_income + 1)
            
            score = (
                (data['credit_score'] / 900) * 40 +
                (1 - min(debt_to_income, 1)) * 30 +
                (data['age'] / 60) * 20 +
                (1 - (data['existing_loans'] / 10)) * 10
            )
            
            prediction = 1 if score > 50 else 0
            confidence = min(score, 100)

        result = {
            'prediction': 'Approved' if prediction == 1 else 'Rejected',
            'confidence': round(confidence, 2),
            'status': 'success'
        }

        logging.info(f'Prediction made: {result}')
        return jsonify(result), 200

    except Exception as e:
        logging.error(f'Error during prediction: {str(e)}')
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Predict for multiple applications"""
    try:
        data = request.get_json()
        applications = data.get('applications', [])
        
        results = []
        for app_data in applications:
            # Prepare features
            features = np.array([
                app_data['applicant_income'],
                app_data['coapplicant_income'],
                le_employment.transform([app_data['employment_status']])[0],
                app_data['age'],
                le_marital.transform([app_data['marital_status']])[0],
                app_data['dependents'],
                app_data['credit_score'],
                app_data['existing_loans'],
                app_data['loan_amount'],
                app_data['loan_term'],
                le_home.transform([app_data['home_ownership']])[0],
                app_data['years_employed']
            ]).reshape(1, -1)

            if model:
                prediction = model.predict(features)[0]
                confidence = float(max(model.predict_proba(features)[0])) * 100
            else:
                total_income = app_data['applicant_income'] + app_data['coapplicant_income']
                debt_to_income = app_data['loan_amount'] / (total_income + 1)
                score = (
                    (app_data['credit_score'] / 900) * 40 +
                    (1 - min(debt_to_income, 1)) * 30 +
                    (app_data['age'] / 60) * 20 +
                    (1 - (app_data['existing_loans'] / 10)) * 10
                )
                prediction = 1 if score > 50 else 0
                confidence = min(score, 100)

            results.append({
                'applicant_id': app_data.get('applicant_id'),
                'prediction': 'Approved' if prediction == 1 else 'Rejected',
                'confidence': round(confidence, 2)
            })

        return jsonify({'results': results, 'status': 'success'}), 200

    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
