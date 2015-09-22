from flask import Flask
from jinja2 import Environment, FileSystemLoader

app = Flask(__name__)
env = Environment(loader=FileSystemLoader(['templates', '../assets']),
                  block_start_string='[%',
                  block_end_string='%]',
                  variable_start_string='[[',
                  variable_end_string=']]')


@app.route("/")
def hello():
    template = env.get_template('calculator.html')
    return template.render()


if __name__ == "__main__":
    app.run(debug=True, port=8080)
