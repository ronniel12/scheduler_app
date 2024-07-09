from app import db
from datetime import datetime

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    is_supervisor = db.Column(db.Boolean, default=False)
    skills = db.relationship('Skill', secondary='employee_skills', back_populates='employees')

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    employees = db.relationship('Employee', secondary='employee_skills', back_populates='skills')

employee_skills = db.Table('employee_skills',
    db.Column('employee_id', db.Integer, db.ForeignKey('employee.id')),
    db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'))
)

class ShiftType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    required_skill_id = db.Column(db.Integer, db.ForeignKey('skill.id'))
    required_skill = db.relationship('Skill')

class DayOffRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    date = db.Column(db.Date, nullable=False)
    employee = db.relationship('Employee')

class ScheduleSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    roster_start = db.Column(db.Date, nullable=False)
    roster_length = db.Column(db.Integer, nullable=False)