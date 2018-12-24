import json

from flask import Flask
from flask import render_template
import requests
from response_utils import get_artists_albums

app = Flask(__name__, template_folder='templates')


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/api/get_albums')
def get_albums():
    albums = get_artists_albums()
    response = app.response_class(
        response=json.dumps(albums),
        status=200,
        mimetype='application/json'
    )

    return response


if __name__ == '__main__':
    app.run(debug=True, port=8080)
