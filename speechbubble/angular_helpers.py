import json

from speechbubble import app

__all__ = ()


def angular_display_rule(field):
    """
    Turn a rule into an angular ng-show rule, e.g.

    ['somefield', 'neq', '5] becomes:

    ng-show="data['somefield'] != 5"

    Usage:

    <div {{ angular_display_rule(field) }}>

    </div>

    :param field: a form field

    NOTE: This logic would be better handled in custom angular directives.

    """
    def _quote_text(value):
        if type(value).__name__ in ["str", "unicode"]:
            value = "\'{}\'".format(value)
        return value

    def _make_rule(field_name, comp, value):
        rule = 'data.{0} {1} {2}'

        op = {'eq': '==', 'neq': '!='}[comp]

        value = _quote_text(value)

        return rule.format(field_name, op, value)

    if field.display_rule is not None:
        field_name, comp, value = field.display_rule

        if comp == "in":
            rule = " || ".join(_make_rule(field_name, 'eq', val) for val in value)
        else:
            rule = _make_rule(field_name, comp, value)

        return 'ng-show=\"{}\"'.format(rule)

    else:
        return ''

def form_rules_to_json(form):
    rules = {}

    for field in form:
        if field.display_rule:
            rules[field._key] = field.display_rule

    return json.dumps(rules)


app.jinja_env.globals.update(angular_display_rule=angular_display_rule, form_rules_to_json=form_rules_to_json)





