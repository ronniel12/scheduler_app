from flask import render_template, request, redirect, url_for, jsonify
from app import db
from app.models import Employee, Skill, ShiftType, Task, DayOffRequest, ScheduleSettings
from app.utils import create_problem, solve_schedule, create_excel_output
from datetime import datetime, timedelta

def init_app(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/employees', methods=['GET', 'POST'])
    def employees():
        if request.method == 'POST':
            name = request.form['name']
            is_supervisor = 'is_supervisor' in request.form
            skills = request.form.getlist('skills')
            
            employee = Employee(name=name, is_supervisor=is_supervisor)
            for skill_name in skills:
                skill = Skill.query.filter_by(name=skill_name).first()
                if skill:
                    employee.skills.append(skill)
            
            db.session.add(employee)
            db.session.commit()
            return redirect(url_for('employees'))
        
        employees = Employee.query.all()
        skills = Skill.query.all()
        return render_template('employees.html', employees=employees, skills=skills)

    @app.route('/shifts', methods=['GET', 'POST'])
    def shifts():
        if request.method == 'POST':
            name = request.form['name']
            start_time = datetime.strptime(request.form['start_time'], '%H:%M').time()
            end_time = datetime.strptime(request.form['end_time'], '%H:%M').time()
            
            shift_type = ShiftType(name=name, start_time=start_time, end_time=end_time)
            db.session.add(shift_type)
            db.session.commit()
            return redirect(url_for('shifts'))
        
        shift_types = ShiftType.query.all()
        return render_template('shifts.html', shift_types=shift_types)

    @app.route('/tasks', methods=['GET', 'POST'])
    def tasks():
        if request.method == 'POST':
            name = request.form['name']
            required_skill_id = request.form['required_skill']
            
            task = Task(name=name, required_skill_id=required_skill_id)
            db.session.add(task)
            db.session.commit()
            return redirect(url_for('tasks'))
        
        tasks = Task.query.all()
        skills = Skill.query.all()
        return render_template('tasks.html', tasks=tasks, skills=skills)

    @app.route('/day_off_requests', methods=['GET', 'POST'])
    def day_off_requests():
        if request.method == 'POST':
            employee_id = request.form['employee']
            date = datetime.strptime(request.form['date'], '%Y-%m-%d').date()
            
            request = DayOffRequest(employee_id=employee_id, date=date)
            db.session.add(request)
            db.session.commit()
            return redirect(url_for('day_off_requests'))
        
        requests = DayOffRequest.query.all()
        employees = Employee.query.all()
        return render_template('day_off_requests.html', requests=requests, employees=employees)

    @app.route('/schedule_settings', methods=['GET', 'POST'])
    def schedule_settings():
        if request.method == 'POST':
            roster_start = datetime.strptime(request.form['roster_start'], '%Y-%m-%d').date()
            roster_length = int(request.form['roster_length'])
            
            settings = ScheduleSettings(roster_start=roster_start, roster_length=roster_length)
            db.session.add(settings)
            db.session.commit()
            return redirect(url_for('schedule_settings'))
        
        settings = ScheduleSettings.query.order_by(ScheduleSettings.id.desc()).first()
        return render_template('schedule_settings.html', settings=settings)

    @app.route('/generate_schedule')
    def generate_schedule():
        employees = Employee.query.all()
        shift_types = ShiftType.query.all()
        tasks = Task.query.all()
        day_off_requests = DayOffRequest.query.all()
        settings = ScheduleSettings.query.order_by(ScheduleSettings.id.desc()).first()

        employee_list = [Employee(e.name, {s.name for s in e.skills}, e.is_supervisor) for e in employees]
        
        shifts = []
        for day in range(settings.roster_length):
            date = settings.roster_start + timedelta(days=day)
            for shift_type in shift_types:
                shifts.append(Shift(date, shift_type.name == 'Morning'))

        all_tasks = []
        for shift in shifts:
            for task in tasks:
                all_tasks.append(Task(shift, task.name))

        day_off_dict = {}
        for request in day_off_requests:
            if request.employee_id not in day_off_dict:
                day_off_dict[request.employee_id] = []
            day_off_dict[request.employee_id].append(request.date)

        problem = create_problem(settings.roster_start, employee_list, day_off_dict)
        solution = solve_schedule(problem, day_off_dict)
        
        return render_template('view_schedule.html', solution=solution, start_date=settings.roster_start)

    @app.route('/api/crud/<string:model>', methods=['POST', 'PUT', 'DELETE'])
    def crud_operations(model):
        if request.method == 'POST':
            # Create operation
            pass
        elif request.method == 'PUT':
            # Update operation
            pass
        elif request.method == 'DELETE':
            # Delete operation
            pass
        return jsonify({'status': 'success'})