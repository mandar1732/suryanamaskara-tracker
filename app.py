from flask import Flask, request, render_template, redirect, url_for, jsonify
import json

app = Flask(__name__)

def load_data():
    with open('data.json', 'r') as file:
        return json.load(file)

def save_data(data):
    with open('data.json', 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/', methods=['GET', 'POST'])
def index():
    data = load_data()
    if request.method == 'POST':
        name = request.form['name']
        suryanamaskara_count = int(request.form['count'])
        found = False
        for user in data['users']:
            if user['name'] == name:
                user['count'] += suryanamaskara_count
                found = True
                break
        if not found:
            data['users'].append({'name': name, 'count': suryanamaskara_count})
        save_data(data)
        return redirect(url_for('index'))
    leaderboard = sorted(data['users'], key=lambda x: x['count'], reverse=True)
    return render_template('index.html', leaderboard=leaderboard)

if __name__ == '__main__':
    app.run(debug=True)
