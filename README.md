# Charge test job

## Original text

���������� ����������� Web ��������, �������������� �� ���� ����������� TCO, ��������� �� ������ �������� (������� ���������) � ���� ����������� ����������� (�������).

![Charge test job mockup](/src/images/mockup.jpg)

1.	��������� �������� ������ ���� ������������
2.	��� ���� ������ �������� ���������� (2-5 ��������).
3.	� ����������� �� ������� �������� �� ������� ������������ ��������� ��������� � ����������� ��� ������������. ������� ������ � �� ��������, � ���������� �������� ������ ����� � ����������.
4.	��� ��������� ������� ������ ����� ���� �������� �� Web UI � ���� ������������ ������ ��� CSV-������ � ������� (���������� � ���������� ���� �� ���������� ������ ����� ������).
5.	������� ��������� ��������� �������.
6.	���������:
a.	Country ��������� ������ UK � ������������ ����������� �� ������ � ����� ��������� ������� � ��������.
b.	Charge Truck � ������ ����������� �� ���������
c.	ICE ������ � ������ ����������� �� ���������

�������� �����:

1.	� ����������� �� ������ ���������� Diesel Price, Electricity Price, One-Time subsidy, Annual Subsidy.
2.	�� ��������� ������ Daily Range � �������� Zero Emission ���������� ������������ ��������� (X, Y, Z), ��� ���������, � ����� ��������� ������� �� ���
3.	�� ��������� ���������, � ����� Purchase Option �������������� TCO (= ������ �� �������� + ���) ��� ������� ���� �� ������� (Term).
4.	���� ������ ������� � �� �� 0 ��� � ��� ����� ��������� + ���, � ����� ������ ���. ���� ������ � �� ������ ��� ���� ������ ������� + ���.
5.	�������� ��������� � ������������ ���������� (ICE ������) � ��� ���� ��������� ������ �������� � ������� �� ���������.
6.	���������� ������������ �� ��������:?

![Charge test job charts](/src/images/charts.jpg)

### ���������� �� UI

������ ������� - �� ������ ������. ���������. ������������ �� ������.
���� �����, ���������� ������, �������: 
������� ��� ��� ��������� �� ��������� (������) � �� ��������� ��� �������������� � ���� ������������ �������� �� ����� ������������.

�������:

* �������� � ���������.
* ��� ������ �������� �������� ������� �������� � ������� �������.
* ��� ����� ������ � ����� ����� � ����� ����� ����������, ������� ������ ����������� ���������������.
* ������������ ���������� ���������� ������ ������� �� ������� �������� �� �����, �� � ����.
* �������� ������ ���� �������, � �������������� ���������� � ���������.

* ������ ������ �������� �������� ����������� �������

## Run app

To use it, just install the npm dependencies and start server:

```shell
$ npm install
$ npm run dev
$ open [index in browser](http://127.0.0.1:8080/) 
```

## Scripts

All scripts are run with `npm run [script]`, for example: `npm run build`.

* `build` - generate a minified build to dist folder
* `dev` - start development server, try it by opening `http://localhost:8080/`

See what each script does by looking at the `scripts` section in [package.json](./package.json).