class Field:
    def __init__(self, name, label, field_type, disabled=False, nested_fields=None):
        if not nested_fields:
            nested_fields = []

        self.name = name
        self.label = label
        self.type = field_type
        self.disabled = disabled
        self.nestedFields = nested_fields


class FieldNumber(Field):
    def __init__(self, name, label, prefix='', suffix='', disabled=False, nested_fields=None):
        Field.__init__(self, name, label, 'number', disabled, nested_fields)
        self.prefix = prefix
        self.suffix = suffix


class FieldPercent(FieldNumber):
    def __init__(self, name, label, disabled=False, nested_fields=None):
        FieldNumber.__init__(self, name, label, '', '%', disabled, nested_fields)
        self.type = 'percent'


class FieldBoolean(Field):
    def __init__(self, name, label, disabled=False, nested_fields=None):
        Field.__init__(self, name, label, 'boolean', disabled, nested_fields)


class FieldEnum(Field):
    def __init__(self, name, label, options, disabled=False, nested_fields=None):
        Field.__init__(self, name, label, 'enum', disabled, nested_fields)
        self.options = options


class FieldObject(Field):
    def __init__(self, name, label, object_type, label_field, query_url, disabled=False, nested_fields=None):
        Field.__init__(self, name, label, 'object', disabled, nested_fields)
        self.queryUrl = query_url
        self.labelField = label_field
        self.objectType = object_type


class EnumOption:
    def __init__(self, value, label=None, disabled=False):
        if label is None:
            label = value

        self.value = value
        self.label = label
        self.disabled = disabled
