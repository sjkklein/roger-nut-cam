import flask

app = flask.Flask(__name__)

@app.route('/')
def index():
    return flask.render_template('test.html', color="red")

app.run(host='0.0.0.0', port=5999)