import json
from flask import Flask, request
from jinja2 import Environment, FileSystemLoader

import form
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
    form_fields = [
        form.FieldEnum('vehicleType', 'Vehicle type', [
            form.EnumOption(0, '<i class="vehicle-icon vehicle-icon-bus">Bus</i>'),
            form.EnumOption(1, '<i class="vehicle-icon vehicle-icon-truck">Truck</i>'),
        ], False, [
            form.FieldEnum('truckWeight', 'Truck weight', [
                form.EnumOption(3.5),
                form.EnumOption(5.5),
                form.EnumOption(9.5),
                form.EnumOption(26.0),
            ]),
        ]),

        form.FieldObject('countryPrices', 'Country', 'CountryPrices', 'name', '/api/country-prices', False, [
            form.FieldNumber('countryPrices.dieselPrice', 'Diesel price', '', '$/l', True),
            form.FieldNumber('countryPrices.electricityPrice', 'Electricity price', '', 'Cents/kWh', True),
            form.FieldNumber('countryPrices.oneTimeSubsidy', 'One time subsidy', '$', '', True),
            form.FieldNumber('countryPrices.annualSubsidy', 'Annual subsidy', '$', '', True),
        ]),

        form.FieldBoolean('zeroEmission', 'Zero emission'),

        form.FieldNumber('dailyRange', 'Daily range', '', 'km', False, [
            form.FieldNumber('urbanTime', 'Urban time', '', '%'),
            form.FieldNumber('workingDaysPerYear', 'Working days per year', '', '', True),
            form.FieldEnum('rechargingAbility', 'Recharging ability', [
                form.EnumOption(0, 'No'),
                form.EnumOption(1, 'Night only'),
                form.EnumOption(2, 'Intraday'),
            ], False, [
                form.FieldNumber('rechargingFrequency', 'every', '', 'km', {'rechargingAbility': [0]}),
            ]),
        ]),

        form.FieldEnum('purchaseOption', 'Purchase option', [
            form.EnumOption(0, 'One time payment'),
            form.EnumOption(1, 'Leasing'),
        ], False, [
            form.FieldNumber('term', 'Term', '', 'years'),
            form.FieldPercent('interestRate', 'Interest rate', {'purchaseOption': [0]}),
            form.FieldPercent('upfrontPayment', 'Upfront payment', {'purchaseOption': [0]}),
        ])
    ]

    return render_template('calculator.html', form=form_fields)


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
