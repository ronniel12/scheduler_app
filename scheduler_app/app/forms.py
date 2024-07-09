from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SelectField, SelectMultipleField, DateField, TimeField, IntegerField
from wtforms.validators import DataRequired, Length

class EmployeeForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=100)])
    is_supervisor = BooleanField('Is Supervisor')
    skills = SelectMultipleField('Skills', coerce=int)

class ShiftTypeForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=50)])
    start_time = TimeField('Start Time', validators=[DataRequired()])
    end_time = TimeField('End Time', validators=[DataRequired()])

class TaskForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=50)])
    required_skill = SelectField('Required Skill', coerce=int)

class DayOffRequestForm(FlaskForm):
    employee = SelectField('Employee', coerce=int)
    date = DateField('Date', validators=[DataRequired()])

class ScheduleSettingsForm(FlaskForm):
    roster_start = DateField('Roster Start Date', validators=[DataRequired()])
    roster_length = IntegerField('Roster Length (days)', validators=[DataRequired()])