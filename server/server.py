import json
from flask import Flask, request
from jinja2 import Environment, FileSystemLoader

from countryPrices import CountryPricesService
from chargeTruck import ChargeTruckService

app = Flask(__name__)

# make custom templates renderer because
# {% %} used by blueimp in webpack-html-text plugin
env = Environment(loader=FileSystemLoader(['templates', '../assets']),
                  block_start_string='[%',
                  block_end_string='%]',
                  variable_start_string='[[',
                  variable_end_string=']]')


def render_template(template, *args, **kwargs):
    render_vars = dict(*args, **kwargs)
    return env.get_template(template).render(render_vars)


@app.route("/")
def calculator():
    return render_template('calculator.html')


@app.route("/api/country-prices")
def country_prices():
    data = CountryPricesService.get_all()
    return json.dumps(map(lambda item: item.__dict__, data))


@app.route("/api/charge-truck")
def get_charge_truck_info():
    zero_emission = request.args.get('zeroEmission') != 'false'
    daily_range = float(request.args.get('dailyRange'))
    data = ChargeTruckService.get_by(zero_emission, daily_range)

    if data is None:
        return json.dumps({})

    return json.dumps(data.__dict__)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
