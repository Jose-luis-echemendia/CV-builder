from enum import Enum

from app.services.common import format_enum_for_frontend


class SampleEnum(Enum):
    FIRST = "first_value"
    SECOND = "second_value"


def test_format_enum_for_frontend():
    result = format_enum_for_frontend(SampleEnum)
    assert isinstance(result, list)
    assert {"value": "first_value", "label": "First Value"} in result
    assert {"value": "second_value", "label": "Second Value"} in result
