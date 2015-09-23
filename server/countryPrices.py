import csv


class CountryPrices:
    def __init__(self, name, code):
        self.name = name
        self.code = code
        self.dieselPrice = 0.0
        self.electricityPrice = 0.0
        self.oneTimeSubsidy = 0.0
        self.annualSubsidy = 0.0


class CountryPricesService:
    def __init__(self):
        pass

    @staticmethod
    def get_all():
        with open('./data/country-prices.csv', 'rb') as f:
            reader = csv.reader(f)
            data_list = list(reader)

            return filter(lambda item: item is not None,
                          map(CountryPricesService.create_entity_from_csv_row, data_list))

    @staticmethod
    def create_entity_from_csv_row(row):
        try:
            entity = CountryPrices(row[0], row[1])
            entity.dieselPrice = float(row[2])
            entity.electricityPrice = float(row[3])
            entity.oneTimeSubsidy = float(row[4])
            entity.annualSubsidy = float(row[5])
            return entity
        except:
            return None
