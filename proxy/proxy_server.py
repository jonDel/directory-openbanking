import flask
import requests
from flask import request, jsonify


app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    response = flask.jsonify(
        requests.get(
            "https://data.directory.openbankingbrasil.org.br/participants"
        ).json()
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

app.run()
