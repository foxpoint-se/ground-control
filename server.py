import flask
from flask import request, jsonify, send_from_directory

app = flask.Flask(__name__)
app.config["DEBUG"] = True

positions = []


@app.route("/", methods=["GET"])
def home():
    # return app.send_static_file('./static/index.html')
    return send_from_directory("static", "index.html")


@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)


@app.route("/positions", methods=["GET"])
def get_positions():
    return jsonify(positions)


@app.route("/positions", methods=["POST"])
def add_position():
    data = request.get_json()
    print(data)
    positions.append(data)

    return jsonify({})


app.run()
