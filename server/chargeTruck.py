import csv
from operator import attrgetter


class ChargeTruck:
    def __init__(self):
        self.zeroEmission = True
        self.dailyRange = 0
        self.truckX = 0
        self.truckY = 0
        self.truckZ = 0
        self.truckCost = 0
        self.pol = 0


class ChargeTruckService:
    def __init__(self):
        pass

    @staticmethod
    def get_all():
        with open('./data/charge-trucks.csv', 'rb') as f:
            reader = csv.reader(f)
            data_list = list(reader)

            return filter(lambda item: item is not None,
                          map(ChargeTruckService.create_entity_from_csv_row, data_list))

    @staticmethod
    def create_entity_from_csv_row(row):
        try:
            entity = ChargeTruck()
            entity.zeroEmission = int(row[0]) != 0
            entity.dailyRange = float(row[1])
            entity.truckX = float(row[2])
            entity.truckY = float(row[3])
            entity.truckZ = float(row[4])
            entity.truckCost = float(row[5])
            entity.pol = float(row[6])
            return entity
        except:
            return None

    @staticmethod
    def get_by(zero_emission, daily_range):
        if daily_range is None:
            return None

        trucks = ChargeTruckService.get_all()
        nearestTruck = None
        maxTruck = None

        for truck in trucks:
            if truck.zeroEmission != zero_emission:
                continue

            if maxTruck is None or truck.dailyRange > maxTruck.dailyRange:
                maxTruck = truck

            if truck.dailyRange < daily_range:
                continue

            if nearestTruck is not None and truck.dailyRange >= nearestTruck.dailyRange: continue
            nearestTruck = truck

        if nearestTruck is None:
            return maxTruck

        return nearestTruck
